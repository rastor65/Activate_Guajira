from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import base64

# Generar clave privada
private_key = ec.generate_private_key(ec.SECP256R1())

# Clave privada en base64url (32 bytes)
private_key_bytes = private_key.private_numbers().private_value.to_bytes(32, byteorder="big")
private_key_b64 = base64.urlsafe_b64encode(private_key_bytes).decode("utf-8")

# Clave pública en base64url (formato UncompressedPoint)
public_key_bytes = private_key.public_key().public_bytes(
    encoding=serialization.Encoding.X962,
    format=serialization.PublicFormat.UncompressedPoint
)
public_key_b64 = base64.urlsafe_b64encode(public_key_bytes).decode("utf-8")

print("🔐 Clave privada VAPID (backend):", private_key_b64)
print("📣 Clave pública VAPID (frontend):", public_key_b64)
