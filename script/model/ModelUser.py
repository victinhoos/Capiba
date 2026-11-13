from dataclasses import dataclass


@dataclass
class UserModel:
    nome: str
    tema: str
    fonte: int