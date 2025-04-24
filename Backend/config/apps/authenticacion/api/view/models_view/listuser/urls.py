from .....mudules import path
from .listuser import UsersView

urlpatterns = [
    path('', UsersView.as_view(), name='users-list'),
]
