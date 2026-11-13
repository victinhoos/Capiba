import configparser
from pathlib import Path

from model.ModelUser import UserModel


class UserService:

    def __init__(self):
        self.config_path = (
            Path(__file__).resolve().parents[2] / "config.ini"
        )

        self.config = configparser.ConfigParser()

        self.criar_configuracao()

    def criar_configuracao(self):
        """Cria o arquivo INI caso ele ainda não exista."""

        if not self.config_path.exists():

            self.config["usuario"] = {
                "nome": "",
                "config": "false"
            }

            self.config["accessibility"] = {
                "theme": "",
                "font": ""
            }

            self.salvar_arquivo()

    def salvar_arquivo(self):
        """Persiste as configurações no arquivo INI."""

        with open(self.config_path, "w", encoding="utf-8") as arquivo:
            self.config.write(arquivo)

    def verificar_configuracao(self):
        """Verifica se o primeiro acesso já foi concluído."""

        self.config.read(self.config_path, encoding="utf-8")

        if not self.config.has_section("usuario"):
            return False

        return self.config.getboolean(
            "usuario",
            "config",
            fallback=False
        )

    def obter_usuario(self):
        """Retorna os dados do usuário e suas preferências."""

        if not self.verificar_configuracao():
            return None

        return UserModel(
            nome=self.config.get("usuario", "nome", fallback=""),
            tema=self.config.get("accessibility", "theme", fallback=""),
            fonte=self.config.getint("accessibility", "font")
        )   

    def salvar_preferencias(self, nome, tema, fonte):
        """Salva as preferências escolhidas no assistente."""

        self.config.read(self.config_path, encoding="utf-8")

        if not self.config.has_section("usuario"):
            self.config.add_section("usuario")

        if not self.config.has_section("accessibility"):
            self.config.add_section("accessibility")

        self.config.set("usuario", "nome", nome.strip())
        self.config.set("usuario", "config", "true")

        self.config.set("accessibility", "theme", tema)
        self.config.set("accessibility", "font", str(fonte))

        self.salvar_arquivo()

        return {
            "sucesso": True,
            "mensagem": "Preferências salvas com sucesso!"
        }