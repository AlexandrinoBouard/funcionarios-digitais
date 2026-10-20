import http.server
import socketserver
import webbrowser
import os
import sys

BASE_PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def get_server(start_port=BASE_PORT, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        try:
            httpd = socketserver.TCPServer(("", port), Handler)
            return httpd, port
        except OSError:
            continue
    return None, None

def run():
    os.chdir(DIRECTORY)
    httpd, port = get_server(BASE_PORT)
    if not httpd:
        print("Erro: Nenhuma porta livre encontrada.")
        sys.exit(1)

    url = f"http://localhost:{port}"
    print("=" * 60)
    print("🚀 AtendeZap 24h - Servidor Local Iniciado!")
    print(f"👉 Link do site: {url}")
    print("Pressione Ctrl+C para encerrar o servidor.")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
        sys.exit(0)

if __name__ == "__main__":
    run()
