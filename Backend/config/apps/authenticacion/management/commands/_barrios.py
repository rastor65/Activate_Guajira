"""Barrios por municipio.

IMPORTANTE sobre el alcance: no existe un dataset nacional de barrios.
La DIVIPOLA del DANE llega hasta municipio y centro poblado; los barrios
los define cada alcaldia en su POT y no hay fuente unificada.

Estos datos vienen de OpenStreetMap (ODbL) y la cobertura es PARCIAL:
Riohacha esta razonablemente cubierta, el resto de municipios apenas.
Por eso cada municipio incluye ademas la opcion 'Otro'.

La clave es el codigo DANE del municipio.
"""

BARRIOS = {
    # Riohacha
    "44001": [
        "Almirante Padilla",
        "Bocagrande",
        "Buenos Aires",
        "Camilo Torres",
        "Centro Histórico",
        "Coquivacoa",
        "Divino Niño",
        "Dos de Febrero",
        "Edilson Deluque Pinto",
        "El Abajo",
        "El Acueducto",
        "El Aeropuerto",
        "El Arriba",
        "El Caribe",
        "El Centro",
        "El Cooperativo",
        "El Dividivi",
        "El Faro",
        "El Libertador",
        "El Paraiso",
        "Entre Ríos",
        "Ernesto Che Guevara",
        "Jorge Pérez",
        "José Antonio Galán",
        "José Arnoldo Marín",
        "La Loma",
        "La Lucha",
        "La Ñapa",
        "Laguna Salada",
        "Las Tunas",
        "Los Cardonales",
        "Los Medanos",
        "Los Olivos",
        "Los Remedios",
        "Los Trupillos",
        "Luis Eduardo Cuellar",
        "Majayura",
        "Mano de Dios",
        "María Eugenia Rojas",
        "Nazareth",
        "Nuestra Señora de los Remedios",
        "Nuevo Centro",
        "Nuevo Faro",
        "Nuevo Horizonte",
        "Nuevo Milenio",
        "Pinal del Río",
        "Ranchería",
        "San Isidro",
        "San Martín de Loba",
        "San Martín de Porres",
        "Siete de Agosto",
        "Simón Bolívar",
        "Villa Fátima",
        "Villa Keiner",
        "Villa La Unión",
        "Villa Laura",
        "Villa Tatiana",
        "Villa Yolima",
        "Villa Ziruma",
        "Villa de Campo Alegre",
    ],
    # Villanueva
    "44874": [
        "Colonia Arturo Castro",
        "Colonia La Guadalupe",
        "Colonia Stibys",
        "La Victoria",
        "Residencial Buena Vista",
    ],
}
