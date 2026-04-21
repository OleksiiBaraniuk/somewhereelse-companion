#!/usr/bin/env python3
"""
Dev server for SomewhereElse Companion
Runs on http://localhost:8080
"""

import http.server
import socketserver
import os
import webbrowser
from threading import Timer

PORT = 8080
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def log_message(self, format, *args):
        print(f"  {self.address_string()} → {format % args}")

def open_browser():
    webbrowser.open(f"http://localhost:{PORT}")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"")
    print(f"  ⚔️  SomewhereElse Companion — Dev Server")
    print(f"  ✅  http://localhost:{PORT}")
    print(f"  📁  {DIR}")
    print(f"  🛑  Ctrl+C to stop")
    print(f"")
    Timer(0.5, open_browser).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
