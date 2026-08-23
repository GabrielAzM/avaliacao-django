from django.db import models


class Perfil(models.Model):
    nome = models.CharField(max_length=100)
    empresa = models.CharField(max_length=100, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nome
