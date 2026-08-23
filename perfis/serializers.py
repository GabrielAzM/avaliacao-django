from rest_framework import serializers

from .models import Perfil


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['id', 'nome', 'empresa', 'telefone', 'email', 'senha', 'token']
        read_only_fields = ['id', 'token']


class PerfilCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['nome', 'empresa', 'telefone', 'email', 'senha']

    def validate_email(self, value):
        if Perfil.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este e-mail já está cadastrado.')
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True)
