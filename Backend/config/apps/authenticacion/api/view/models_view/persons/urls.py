from .....mudules import path
from .persons import *

urlpatterns = [
    path('', PersonList.as_view()),
    path('<int:pk>/', PersonDetail.as_view(), name='update-person'),
    path('by-user/<int:user_id>/', PersonByUserIdView.as_view(), name='update-person-user'),
]
