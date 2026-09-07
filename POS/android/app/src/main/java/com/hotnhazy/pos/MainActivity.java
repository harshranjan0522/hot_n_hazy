package com.hotnhazy.pos;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

/**
 * The whole app: one WebView showing the till that is bundled in assets.
 *
 * The till is served through WebViewAssetLoader rather than loaded from a
 * file:// URL. That matters — over file:// the browser blocks ES module
 * imports and refuses to register a service worker, so the app simply would
 * not start. The loader hands the same files back over a real https:// origin,
 * where everything behaves as it does in a desktop browser.
 *
 * Nothing here touches the network, and the app asks for no permissions.
 */
public class MainActivity extends Activity {

    /** Any host works; this is the one Google documents for asset loading. */
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final String START_URL = ORIGIN + "/assets/index.html";

    /** Two taps to leave, so a stray back press cannot bin a half-built order. */
    private static final long BACK_TO_EXIT_WINDOW_MS = 2500L;

    /**
     * receipt.js calls window.print(), which a WebView ignores. Repointing it
     * at the bridge here keeps the web code identical to the browser build.
     */
    private static final String PRINT_SHIM =
            "(function () {"
            + "  if (window.AndroidPOS && !window.__hazyPrintBridged) {"
            + "    window.__hazyPrintBridged = true;"
            + "    window.print = function () { window.AndroidPOS.print(); };"
            + "  }"
            + "})();";

    private WebView webView;
    private long lastBackPress = 0L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // A counter screen going to sleep between customers is a nuisance.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain("appassets.androidplatform.net")
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        // localStorage is where the menu, users and the day's orders live.
        settings.setDomStorageEnabled(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        // The layout is already responsive; let it use the real viewport.
        settings.setUseWideViewPort(false);
        settings.setLoadWithOverviewMode(false);

        webView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                view.evaluateJavascript(PRINT_SHIM, null);
            }
        });

        // The service worker fetches through its own path, so it needs the same
        // loader or its install would fail against the bundled assets.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                    return assetLoader.shouldInterceptRequest(request.getUrl());
                }
            });
        }

        webView.addJavascriptInterface(new PrintBridge(), "AndroidPOS");

        if (savedInstanceState == null) {
            webView.loadUrl(START_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    /**
     * A WebView ignores window.print() entirely, so receipt.js would silently
     * do nothing. The till calls window.print(); this bridge is what turns
     * that into Android's print dialog, which is where a thermal printer
     * (Bluetooth, USB or a print service) is picked.
     *
     * PRINT_SHIM is injected on every page finish, which is what repoints
     * window.print at this bridge without changing the web code.
     */
    private final class PrintBridge {
        @JavascriptInterface
        public void print() {
            runOnUiThread(MainActivity.this::printReceipts);
        }
    }

    private void printReceipts() {
        PrintManager printManager = (PrintManager) getSystemService(PRINT_SERVICE);
        if (printManager == null) {
            Toast.makeText(this, "No print service on this device", Toast.LENGTH_LONG).show();
            return;
        }
        String jobName = getString(R.string.print_job);
        PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(jobName);
        printManager.print(jobName, adapter, new PrintAttributes.Builder().build());
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            long now = System.currentTimeMillis();
            if (now - lastBackPress < BACK_TO_EXIT_WINDOW_MS) {
                finish();
            } else {
                lastBackPress = now;
                Toast.makeText(this, R.string.back_hint, Toast.LENGTH_SHORT).show();
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
