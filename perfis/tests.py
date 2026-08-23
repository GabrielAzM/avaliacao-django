from django.test import TestCase
from django.urls import reverse

from perfis.models import Perfil


class PerfilApiTests(TestCase):
    def setUp(self):
        self.perfil = Perfil.objects.create(
            nome='Fábio Henrique',
            empresa='IFB',
            telefone='34343434',
            email='fabio.oliveira@ifb.edu.br',
            senha='123456',
        )

    def test_lista_perfis(self):
        response = self.client.get(reverse('api_perfis'))
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_login_valido(self):
        response = self.client.post(
            reverse('api_login'),
            {'email': 'fabio.oliveira@ifb.edu.br', 'senha': '123456'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.json())

    def test_criar_perfil(self):
        payload = {
            'nome': 'Daniel Barros',
            'empresa': 'IFB',
            'telefone': '99999999',
            'email': 'daniel@email.com',
            'senha': '123456',
        }
        response = self.client.post(reverse('api_criar_perfil'), payload, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.json())
