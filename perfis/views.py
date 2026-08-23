from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Perfil
from .serializers import LoginSerializer, PerfilCreateSerializer, PerfilSerializer


def index(request):
    return render(request, 'perfis/index.html')


@api_view(['GET'])
def api_perfis(request):
    perfis = Perfil.objects.all().order_by('id')
    serializer = PerfilSerializer(perfis, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def api_criar_perfil(request):
    serializer = PerfilCreateSerializer(data=request.data)
    if serializer.is_valid():
        perfil = serializer.save()
        perfil.token = f"token-{perfil.id}-{perfil.email}"
        perfil.save(update_fields=['token'])
        response = PerfilSerializer(perfil)
        return Response({**response.data, 'token': perfil.token}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_perfil_detail(request, perfil_id):
    perfil = Perfil.objects.filter(id=perfil_id).first()
    if not perfil:
        return Response({'detail': 'Perfil não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(PerfilSerializer(perfil).data)


@api_view(['GET'])
def api_perfil(request):
    token = request.headers.get('Authorization', '').replace('Token ', '')
    perfil = Perfil.objects.filter(token=token).first()
    if not perfil:
        return Response({'detail': 'Token inválido.'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(PerfilSerializer(perfil).data)


@api_view(['POST'])
def api_login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    senha = serializer.validated_data['senha']
    perfil = Perfil.objects.filter(email=email, senha=senha).first()

    if not perfil:
        return Response({'detail': 'Credenciais inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

    perfil.token = f"token-{perfil.id}-{perfil.email}"
    perfil.save(update_fields=['token'])
    return Response({'token': perfil.token, 'perfil': PerfilSerializer(perfil).data})


@api_view(['POST'])
def api_logout(request):
    return Response({'detail': 'Logout realizado com sucesso.'})
