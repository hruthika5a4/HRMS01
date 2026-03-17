from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeListCreate(APIView):
    """
    Handles listing employees and adding new ones.
    """
    def get(self, request):
        employees = Employee.objects.all().order_by('employee_id')
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeDetail(APIView):
    """
    Handles retrieving and deleting a specific employee.
    """
    def get(self, request, pk):
        employee = get_object_or_404(Employee, pk=pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

    def put(self, request, pk):
        employee = get_object_or_404(Employee, pk=pk)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
            employee.delete()
            return Response({"message": "Employee deleted successfully."}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

class AttendanceListCreate(APIView):
    """
    Handles marking attendance and viewing attendance records.
    """
    def get(self, request):
        queryset = Attendance.objects.select_related('employee').all().order_by('-date')
        
        employee_id = request.query_params.get('employee')
        date = request.query_params.get('date')
        status_filter = request.query_params.get('status')

        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)
        if date:
            queryset = queryset.filter(date=date)
        if status_filter:
            queryset = queryset.filter(status__iexact=status_filter)

        serializer = AttendanceSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AttendanceDetail(APIView):
    """
    Handles deleting a specific attendance record.
    """
    def delete(self, request, pk):
        try:
            attendance = Attendance.objects.get(pk=pk)
            attendance.delete()
            return Response({"message": "Attendance record deleted successfully."}, status=status.HTTP_200_OK)
        except Attendance.DoesNotExist:
            return Response({"error": "Record not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        attendance = get_object_or_404(Attendance, pk=pk)
        new_status = request.data.get('status')
        if new_status in ['Present', 'Absent']:
            attendance.status = new_status
            attendance.save()
            return Response(AttendanceSerializer(attendance).data)
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)