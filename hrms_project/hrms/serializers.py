from rest_framework import serializers
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    # Always read-only — auto-generated on creation, never editable after
    employee_id = serializers.CharField(read_only=True)
    total_present_days = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'total_present_days']

    def get_total_present_days(self, obj):
        return obj.attendance_records.filter(status='Present').count()

    def create(self, validated_data):
        # Auto-generate employee_id: count all employees and pad to 3 digits
        count = Employee.objects.count() + 1
        validated_data['employee_id'] = f'EMP{count:03d}'
        # Handle rare collision (e.g. if records were deleted)
        while Employee.objects.filter(employee_id=validated_data['employee_id']).exists():
            count += 1
            validated_data['employee_id'] = f'EMP{count:03d}'
        return super().create(validated_data)


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_code = serializers.CharField(source='employee.employee_id', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'employee_code', 'date', 'status']

    def validate(self, attrs):
        employee = attrs.get('employee')
        date = attrs.get('date')

        if employee and date:
            qs = Attendance.objects.filter(employee=employee, date=date)

            if self.instance:
                qs = qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError(
                    {"error": "Attendance already marked for this employee on this date."}
                )

        return attrs