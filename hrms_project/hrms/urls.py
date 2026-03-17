from django.urls import path
from .views import EmployeeListCreate, EmployeeDetail, AttendanceListCreate, AttendanceDetail

urlpatterns = [
    path('employees/', EmployeeListCreate.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeDetail.as_view(), name='employee-detail'),
    path('attendance/', AttendanceListCreate.as_view(), name='attendance-list-create'),
    path('attendance/<int:pk>/', AttendanceDetail.as_view(), name='attendance-detail'),
]