#GDK_BACKEND=x11 python script/main.py

import webview
from pathlib import Path

from controller.ControllerUser import UserController


BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "web"


def iniciar():

    controller = UserController()

    if controller.verificar_configuracao():
        pagina = WEB_DIR / "index.html"
        print("Configuração encontrada!")
    else:
        pagina = WEB_DIR / "setup.html"
        print("Primeiro acesso!")

    if not pagina.exists():
        raise FileNotFoundError(f"Página não encontrada: {pagina}")

    webview.create_window(
        "Capiba",
        url=pagina.as_uri(),
        js_api=controller,
        width=750,
        height=650,
        resizable=False,
        min_size=(750, 650)
    )

    webview.start(gui="qt")


if __name__ == "__main__":
    iniciar()