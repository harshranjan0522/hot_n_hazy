(*
	Hot n' Hazy POS — macOS launcher.

	The till is a local web app, so this bundle does two things: start the
	bundled static server from inside Contents/Resources/app, and open it in a
	chrome-less window. It stays open so that quitting it also stops the
	server — otherwise a stray node process would hold the port after the
	shift.

	ES modules will not load over file://, which is why a server is involved at
	all rather than just opening the HTML.
*)

property serverPort : 8173
property serverPid : ""

on appRoot()
	set myPath to POSIX path of (path to me)
	return myPath & "Contents/Resources/app"
end appRoot

(* osascript runs with a bare PATH, so node has to be hunted down. *)
on findNode()
	repeat with candidate in {"/opt/homebrew/bin/node", "/usr/local/bin/node", "/usr/bin/node"}
		try
			do shell script "test -x " & quoted form of (candidate as text)
			return candidate as text
		end try
	end repeat
	try
		return do shell script "/bin/bash -lc 'command -v node'"
	end try
	return ""
end findNode

on portIsOpen()
	try
		do shell script "/bin/bash -c 'exec 3<>/dev/tcp/127.0.0.1/" & serverPort & "'"
		return true
	on error
		return false
	end try
end portIsOpen

on openTill()
	set theUrl to "http://localhost:" & serverPort & "/"
	(* Chrome's app mode gives a window with no tabs or address bar, which is
	   what you want on a counter. Any other browser is fine too. *)
	try
		do shell script "test -d '/Applications/Google Chrome.app'"
		do shell script "open -na 'Google Chrome' --args --app=" & quoted form of theUrl
	on error
		open location theUrl
	end try
end openTill

on run
	if portIsOpen() then
		openTill()
		return
	end if

	set nodeBin to findNode()
	if nodeBin is "" then
		display alert "Node.js is required" message "Hot n' Hazy POS runs a small local server and needs Node.js installed. Get it from nodejs.org, then open this app again." as critical
		quit
		return
	end if

	set serverPid to do shell script "cd " & quoted form of appRoot() & " && nohup " & quoted form of nodeBin & " serve.mjs " & serverPort & " > /tmp/hot-n-hazy-pos.log 2>&1 & echo $!"

	(* Give the listener a moment before pointing a browser at it. *)
	repeat 20 times
		if portIsOpen() then exit repeat
		delay 0.25
	end repeat

	if not portIsOpen() then
		display alert "Could not start the till" message "The local server did not come up. /tmp/hot-n-hazy-pos.log has the details." as critical
		quit
		return
	end if

	openTill()
end run

on idle
	return 60
end idle

on quit
	if serverPid is not "" then
		try
			do shell script "kill " & serverPid
		end try
	end if
	continue quit
end quit
