"""
Database Seed Script
Initial data for Saudi Cable Company Dashboard
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models import (
    Plant, Machine, Employee,
    WorkOrder, MaintenanceTask
)


def seed_plants(db: Session):
    """Seed initial plant data."""
    plants = [
        Plant(
            name="PCP-1 Drawing Plant",
            name_ar="مصنع السحب PCP-1",
            code="PCP-1",
            description="Wire drawing and stranding plant",
            capacity_tons_per_day=50.0,
            is_active=True
        ),
        Plant(
            name="PCP-2 Drawing Plant",
            name_ar="مصنع السحب PCP-2",
            code="PCP-2",
            description="Wire drawing and stranding plant",
            capacity_tons_per_day=45.0,
            is_active=True
        ),
        Plant(
            name="PCP-3 Drawing Plant",
            name_ar="مصنع السحب PCP-3",
            code="PCP-3",
            description="Wire drawing and stranding plant",
            capacity_tons_per_day=40.0,
            is_active=True
        ),
        Plant(
            name="CV Line",
            name_ar="خط CV",
            code="CV-LINE",
            description="Cross-linked polyethylene insulation line",
            capacity_tons_per_day=30.0,
            is_active=True
        ),
        Plant(
            name="PVC & Reel Plant",
            name_ar="مصنع PVC والبكرات",
            code="PVC-REEL",
            description="PVC insulation and cable reeling",
            capacity_tons_per_day=35.0,
            is_active=True
        ),
    ]

    for plant in plants:
        existing = db.query(Plant).filter(Plant.code == plant.code).first()
        if not existing:
            db.add(plant)

    db.commit()
    return db.query(Plant).all()


def seed_machines(db: Session, plants: list):
    """Seed initial machine data."""
    plant_map = {p.code: p.id for p in plants}

    machines = [
        # PCP-1 Drawing Machines
        Machine(
            name="Bull Block 1",
            name_ar="بول بلوك 1",
            code="BC-1",
            machine_type="bull_block",
            plant_id=plant_map.get("PCP-1"),
            area="Drawing",
            status="running",
            max_speed=25.0,
            current_speed=22.5,
            target_oee=85.0
        ),
        Machine(
            name="Bull Block 2",
            name_ar="بول بلوك 2",
            code="BC-2",
            machine_type="bull_block",
            plant_id=plant_map.get("PCP-1"),
            area="Drawing",
            status="running",
            max_speed=25.0,
            current_speed=20.0,
            target_oee=85.0
        ),
        Machine(
            name="Bull Block 3",
            name_ar="بول بلوك 3",
            code="BC-3",
            machine_type="bull_block",
            plant_id=plant_map.get("PCP-1"),
            area="Drawing",
            status="idle",
            max_speed=25.0,
            target_oee=85.0
        ),

        # PCP-2 Drawing Machines
        Machine(
            name="Bull Block 4",
            name_ar="بول بلوك 4",
            code="BC-4",
            machine_type="bull_block",
            plant_id=plant_map.get("PCP-2"),
            area="Drawing",
            status="running",
            max_speed=25.0,
            current_speed=23.0,
            target_oee=85.0
        ),
        Machine(
            name="Bull Block 5",
            name_ar="بول بلوك 5",
            code="BC-5",
            machine_type="bull_block",
            plant_id=plant_map.get("PCP-2"),
            area="Drawing",
            status="maintenance",
            max_speed=25.0,
            target_oee=85.0
        ),

        # PCP-3 Drawing Machines
        Machine(
            name="Bull Block 6",
            name_ar="بول بلوك 6",
            code="BC-6",
            machine_type="bull_block",
            plant_id=plant_map.get("PCP-3"),
            area="Drawing",
            status="running",
            max_speed=25.0,
            current_speed=21.0,
            target_oee=85.0
        ),

        # Extrusion Lines
        Machine(
            name="Extrusion Line 1",
            name_ar="خط البثق 1",
            code="XT-11",
            machine_type="extruder",
            plant_id=plant_map.get("PCP-1"),
            area="Extrusion",
            status="running",
            max_speed=100.0,
            current_speed=85.0,
            target_oee=85.0
        ),
        Machine(
            name="Extrusion Line 2",
            name_ar="خط البثق 2",
            code="XT-12",
            machine_type="extruder",
            plant_id=plant_map.get("PCP-1"),
            area="Extrusion",
            status="running",
            max_speed=100.0,
            current_speed=90.0,
            target_oee=85.0
        ),
        Machine(
            name="Extrusion Line 3",
            name_ar="خط البثق 3",
            code="XT-13",
            machine_type="extruder",
            plant_id=plant_map.get("PCP-2"),
            area="Extrusion",
            status="idle",
            max_speed=100.0,
            target_oee=85.0
        ),
        Machine(
            name="Extrusion Line 4",
            name_ar="خط البثق 4",
            code="XT-14",
            machine_type="extruder",
            plant_id=plant_map.get("PCP-2"),
            area="Extrusion",
            status="running",
            max_speed=100.0,
            current_speed=78.0,
            target_oee=85.0
        ),
        Machine(
            name="Extrusion Line 5",
            name_ar="خط البثق 5",
            code="XT-15",
            machine_type="extruder",
            plant_id=plant_map.get("PCP-3"),
            area="Extrusion",
            status="running",
            max_speed=100.0,
            current_speed=82.0,
            target_oee=85.0
        ),

        # CV Line
        Machine(
            name="CV Line Main",
            name_ar="خط CV الرئيسي",
            code="CV-1",
            machine_type="cv_line",
            plant_id=plant_map.get("CV-LINE"),
            area="CV Line",
            status="running",
            max_speed=50.0,
            current_speed=45.0,
            target_oee=90.0
        ),

        # Stranding Machines
        Machine(
            name="Strander 1",
            name_ar="آلة الجدل 1",
            code="XL-1",
            machine_type="strander",
            plant_id=plant_map.get("PCP-1"),
            area="Stranding",
            status="running",
            max_speed=200.0,
            current_speed=180.0,
            target_oee=85.0
        ),
        Machine(
            name="Strander 2",
            name_ar="آلة الجدل 2",
            code="XL-2",
            machine_type="strander",
            plant_id=plant_map.get("PCP-2"),
            area="Stranding",
            status="running",
            max_speed=200.0,
            current_speed=175.0,
            target_oee=85.0
        ),
        Machine(
            name="Strander 3",
            name_ar="آلة الجدل 3",
            code="XL-3",
            machine_type="strander",
            plant_id=plant_map.get("PCP-2"),
            area="Stranding",
            status="idle",
            max_speed=200.0,
            target_oee=85.0
        ),
        Machine(
            name="Strander 4",
            name_ar="آلة الجدل 4",
            code="XL-4",
            machine_type="strander",
            plant_id=plant_map.get("PCP-3"),
            area="Stranding",
            status="running",
            max_speed=200.0,
            current_speed=165.0,
            target_oee=85.0
        ),

        # PVC & Reel
        Machine(
            name="PVC Line 1",
            name_ar="خط PVC 1",
            code="PVC-1",
            machine_type="pvc_line",
            plant_id=plant_map.get("PVC-REEL"),
            area="PVC",
            status="running",
            max_speed=80.0,
            current_speed=72.0,
            target_oee=85.0
        ),
        Machine(
            name="Reeling Machine 1",
            name_ar="آلة اللف 1",
            code="RL-1",
            machine_type="reeler",
            plant_id=plant_map.get("PVC-REEL"),
            area="Reeling",
            status="running",
            max_speed=300.0,
            current_speed=280.0,
            target_oee=90.0
        ),
    ]

    for machine in machines:
        existing = db.query(Machine).filter(Machine.code == machine.code).first()
        if not existing:
            db.add(machine)

    db.commit()
    return db.query(Machine).all()


def seed_employees(db: Session, machines: list):
    """Seed initial employee data."""
    employees = [
        Employee(
            employee_number="EMP001",
            name="Ahmed Al-Rashid",
            name_ar="أحمد الراشد",
            role="Operator",
            department="Drawing",
            shift="A"
        ),
        Employee(
            employee_number="EMP002",
            name="Mohammed Hassan",
            name_ar="محمد حسن",
            role="Operator",
            department="Drawing",
            shift="A"
        ),
        Employee(
            employee_number="EMP003",
            name="Khalid Ibrahim",
            name_ar="خالد إبراهيم",
            role="Supervisor",
            department="Drawing",
            shift="A"
        ),
        Employee(
            employee_number="EMP004",
            name="Faisal Al-Otaibi",
            name_ar="فيصل العتيبي",
            role="Operator",
            department="Extrusion",
            shift="B"
        ),
        Employee(
            employee_number="EMP005",
            name="Omar Al-Ghamdi",
            name_ar="عمر الغامدي",
            role="Operator",
            department="Extrusion",
            shift="B"
        ),
        Employee(
            employee_number="EMP006",
            name="Saad Al-Mutairi",
            name_ar="سعد المطيري",
            role="Technician",
            department="Maintenance",
            shift="A"
        ),
        Employee(
            employee_number="EMP007",
            name="Abdullah Al-Qahtani",
            name_ar="عبدالله القحطاني",
            role="Inspector",
            department="Quality",
            shift="A"
        ),
        Employee(
            employee_number="EMP008",
            name="Nasser Al-Harbi",
            name_ar="ناصر الحربي",
            role="Operator",
            department="CV Line",
            shift="A"
        ),
        Employee(
            employee_number="EMP009",
            name="Turki Al-Shehri",
            name_ar="تركي الشهري",
            role="Supervisor",
            department="Maintenance",
            shift="B"
        ),
        Employee(
            employee_number="EMP010",
            name="Majed Al-Dossari",
            name_ar="ماجد الدوسري",
            role="Operator",
            department="PVC",
            shift="C"
        ),
    ]

    for emp in employees:
        existing = db.query(Employee).filter(Employee.employee_number == emp.employee_number).first()
        if not existing:
            db.add(emp)

    db.commit()
    return db.query(Employee).all()


def seed_work_orders(db: Session, machines: list):
    """Seed initial work orders."""
    machine_map = {m.code: m.id for m in machines}

    work_orders = [
        WorkOrder(
            order_number="WO-2024-001",
            product_name="1.5mm² Building Wire",
            product_code="BW-1.5",
            machine_id=machine_map.get("XT-11"),
            quantity_planned=5000.0,
            quantity_completed=3500.0,
            unit="meters",
            status="in_progress",
            priority="high",
            color_code="White",
            scheduled_start=datetime.now() - timedelta(hours=4),
            scheduled_end=datetime.now() + timedelta(hours=4)
        ),
        WorkOrder(
            order_number="WO-2024-002",
            product_name="2.5mm² Building Wire",
            product_code="BW-2.5",
            machine_id=machine_map.get("XT-12"),
            quantity_planned=8000.0,
            quantity_completed=2000.0,
            unit="meters",
            status="in_progress",
            priority="medium",
            color_code="Red",
            scheduled_start=datetime.now() - timedelta(hours=2),
            scheduled_end=datetime.now() + timedelta(hours=6)
        ),
        WorkOrder(
            order_number="WO-2024-003",
            product_name="4mm² Building Wire",
            product_code="BW-4.0",
            machine_id=machine_map.get("XT-14"),
            quantity_planned=6000.0,
            quantity_completed=0.0,
            unit="meters",
            status="pending",
            priority="medium",
            color_code="Blue",
            scheduled_start=datetime.now() + timedelta(hours=2),
            scheduled_end=datetime.now() + timedelta(hours=10)
        ),
        WorkOrder(
            order_number="WO-2024-004",
            product_name="10mm² Power Cable",
            product_code="PC-10",
            machine_id=machine_map.get("CV-1"),
            quantity_planned=2000.0,
            quantity_completed=500.0,
            unit="meters",
            status="in_progress",
            priority="high",
            scheduled_start=datetime.now() - timedelta(hours=6),
            scheduled_end=datetime.now() + timedelta(hours=6)
        ),
        WorkOrder(
            order_number="WO-2024-005",
            product_name="16mm² Power Cable",
            product_code="PC-16",
            machine_id=machine_map.get("CV-1"),
            quantity_planned=3000.0,
            status="pending",
            priority="low",
            scheduled_start=datetime.now() + timedelta(hours=8),
            scheduled_end=datetime.now() + timedelta(hours=20)
        ),
    ]

    for wo in work_orders:
        existing = db.query(WorkOrder).filter(WorkOrder.order_number == wo.order_number).first()
        if not existing:
            db.add(wo)

    db.commit()
    return db.query(WorkOrder).all()


def seed_maintenance_tasks(db: Session, machines: list, employees: list):
    """Seed initial maintenance tasks."""
    machine_map = {m.code: m.id for m in machines}
    emp_map = {e.employee_number: e.id for e in employees}

    tasks = [
        MaintenanceTask(
            task_number="MT-2024-001",
            machine_id=machine_map.get("BC-2"),
            maintenance_type="preventive",
            description="Regular oil change and bearing inspection",
            priority="medium",
            status="in_progress",
            assigned_to=emp_map.get("EMP006"),
            scheduled_date=datetime.now(),
            estimated_duration_hours=2.0
        ),
        MaintenanceTask(
            task_number="MT-2024-002",
            machine_id=machine_map.get("XT-11"),
            maintenance_type="corrective",
            description="Replace worn die set",
            priority="high",
            status="in_progress",
            assigned_to=emp_map.get("EMP006"),
            scheduled_date=datetime.now(),
            estimated_duration_hours=4.0
        ),
        MaintenanceTask(
            task_number="MT-2024-003",
            machine_id=machine_map.get("XL-4"),
            maintenance_type="predictive",
            description="Vibration analysis indicates bearing wear",
            priority="medium",
            status="pending",
            scheduled_date=datetime.now() + timedelta(days=2),
            estimated_duration_hours=3.0
        ),
        MaintenanceTask(
            task_number="MT-2024-004",
            machine_id=machine_map.get("BC-5"),
            maintenance_type="preventive",
            description="Full overhaul and calibration",
            priority="high",
            status="in_progress",
            assigned_to=emp_map.get("EMP009"),
            scheduled_date=datetime.now() - timedelta(days=1),
            estimated_duration_hours=8.0
        ),
    ]

    for task in tasks:
        existing = db.query(MaintenanceTask).filter(MaintenanceTask.task_number == task.task_number).first()
        if not existing:
            db.add(task)

    db.commit()
    return db.query(MaintenanceTask).all()


def run_seed(db: Session):
    """Run all seed functions."""
    print("🌱 Seeding database...")

    print("  → Seeding plants...")
    plants = seed_plants(db)
    print(f"    ✓ Created {len(plants)} plants")

    print("  → Seeding machines...")
    machines = seed_machines(db, plants)
    print(f"    ✓ Created {len(machines)} machines")

    print("  → Seeding employees...")
    employees = seed_employees(db, machines)
    print(f"    ✓ Created {len(employees)} employees")

    print("  → Seeding work orders...")
    work_orders = seed_work_orders(db, machines)
    print(f"    ✓ Created {len(work_orders)} work orders")

    print("  → Seeding maintenance tasks...")
    tasks = seed_maintenance_tasks(db, machines, employees)
    print(f"    ✓ Created {len(tasks)} maintenance tasks")

    print("✅ Database seeding complete!")


if __name__ == "__main__":
    from app.db.database import SessionLocal

    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
