from .....mudules import path
from .listuser import UserDetailView

urlpatterns = [
    path('', UserDetailView.as_view(), name='users-detail'),
]
