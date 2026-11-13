from service.ServiceUser import UserService


class UserController:

    def __init__(self):
        self.user_service = UserService()

    def verificar_configuracao(self):
        return self.user_service.verificar_configuracao()

    def salvar_preferencias(self, nome, tema, fonte):
        return self.user_service.salvar_preferencias(
            nome,
            tema,
            fonte
        )
    def obter_usuario(self):

        usuario = self.user_service.obter_usuario()
        
        if usuario is None:
            return None

        return {
            "nome": usuario.nome,
            "tema": usuario.tema,
            "fonte": usuario.fonte
        }