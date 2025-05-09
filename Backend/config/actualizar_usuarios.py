import pandas as pd
from django.contrib.auth import get_user_model

df = pd.read_csv(r'C:\Users\esthe\Desktop\PROYECTOS\DATOS DE ACCESO.csv', sep=';')
df.columns = df.columns.str.strip()
User = get_user_model()

actualizados = 0
no_encontrados = []
errores = []

for _, row in df.iterrows():
    user_id = row['id']
    username = str(row['username']).strip()
    password = str(row['password']).strip()
    try:
        user = User.objects.get(id=user_id)
        user.username = username
        user.set_password(password)
        user.save()
        print(f"Actualizado: {username}")
        actualizados += 1
    except User.DoesNotExist:
        print(f"No encontrado ID: {user_id}")
        no_encontrados.append(user_id)
    except Exception as e:
        print(f"Error con ID {user_id}: {str(e)}")
        errores.append((user_id, str(e)))

print("\nRESULTADOS:")
print(f"Usuarios actualizados correctamente: {actualizados}")
print(f"Usuarios no encontrados: {len(no_encontrados)}")
print(f"Errores durante la actualización: {len(errores)}")
if no_encontrados:
    print("IDs no encontrados:", no_encontrados)
if errores:
    print("Errores:", errores)