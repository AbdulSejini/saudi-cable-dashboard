"""Initial database schema

Revision ID: 001_initial
Revises:
Create Date: 2024-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create plants table
    op.create_table(
        'plants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('name_ar', sa.String(100), nullable=True),
        sa.Column('code', sa.String(20), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('capacity_tons_per_day', sa.Float(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(100), nullable=True),
        sa.Column('role', sa.String(20), default='operator'),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )

    # Create machines table
    op.create_table(
        'machines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('name_ar', sa.String(100), nullable=True),
        sa.Column('code', sa.String(20), nullable=False),
        sa.Column('machine_type', sa.String(50), nullable=False),
        sa.Column('plant_id', sa.Integer(), nullable=True),
        sa.Column('area', sa.String(50), nullable=True),
        sa.Column('status', sa.String(20), default='idle'),
        sa.Column('max_speed', sa.Float(), nullable=True),
        sa.Column('current_speed', sa.Float(), nullable=True),
        sa.Column('target_oee', sa.Float(), default=85.0),
        sa.Column('last_maintenance', sa.DateTime(), nullable=True),
        sa.Column('next_maintenance', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code'),
        sa.ForeignKeyConstraint(['plant_id'], ['plants.id'])
    )

    # Create employees table
    op.create_table(
        'employees',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('employee_number', sa.String(20), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('name_ar', sa.String(100), nullable=True),
        sa.Column('role', sa.String(50), nullable=True),
        sa.Column('department', sa.String(50), nullable=True),
        sa.Column('shift', sa.String(1), nullable=True),
        sa.Column('machine_id', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('employee_number'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'])
    )

    # Create work_orders table
    op.create_table(
        'work_orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_number', sa.String(50), nullable=False),
        sa.Column('product_name', sa.String(100), nullable=False),
        sa.Column('product_code', sa.String(50), nullable=True),
        sa.Column('machine_id', sa.Integer(), nullable=True),
        sa.Column('quantity_planned', sa.Float(), nullable=False),
        sa.Column('quantity_completed', sa.Float(), default=0.0),
        sa.Column('unit', sa.String(20), default='meters'),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('priority', sa.String(20), default='medium'),
        sa.Column('color_code', sa.String(50), nullable=True),
        sa.Column('scheduled_start', sa.DateTime(), nullable=True),
        sa.Column('scheduled_end', sa.DateTime(), nullable=True),
        sa.Column('actual_start', sa.DateTime(), nullable=True),
        sa.Column('actual_end', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('order_number'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'])
    )

    # Create production_logs table
    op.create_table(
        'production_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('machine_id', sa.Integer(), nullable=False),
        sa.Column('work_order_id', sa.Integer(), nullable=True),
        sa.Column('employee_id', sa.Integer(), nullable=True),
        sa.Column('shift', sa.String(1), nullable=False),
        sa.Column('log_date', sa.Date(), nullable=False),
        sa.Column('output_quantity', sa.Float(), nullable=False),
        sa.Column('output_unit', sa.String(20), default='meters'),
        sa.Column('scrap_quantity', sa.Float(), default=0.0),
        sa.Column('runtime_minutes', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id']),
        sa.ForeignKeyConstraint(['work_order_id'], ['work_orders.id']),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'])
    )

    # Create downtime_logs table
    op.create_table(
        'downtime_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('machine_id', sa.Integer(), nullable=False),
        sa.Column('downtime_type', sa.String(20), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('reported_by', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id']),
        sa.ForeignKeyConstraint(['reported_by'], ['employees.id'])
    )

    # Create quality_checks table
    op.create_table(
        'quality_checks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('machine_id', sa.Integer(), nullable=False),
        sa.Column('work_order_id', sa.Integer(), nullable=True),
        sa.Column('inspector_id', sa.Integer(), nullable=True),
        sa.Column('check_type', sa.String(50), nullable=False),
        sa.Column('result', sa.String(20), nullable=False),
        sa.Column('defect_type', sa.String(100), nullable=True),
        sa.Column('defect_count', sa.Integer(), default=0),
        sa.Column('sample_size', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id']),
        sa.ForeignKeyConstraint(['work_order_id'], ['work_orders.id']),
        sa.ForeignKeyConstraint(['inspector_id'], ['employees.id'])
    )

    # Create scrap_entries table
    op.create_table(
        'scrap_entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('machine_id', sa.Integer(), nullable=False),
        sa.Column('work_order_id', sa.Integer(), nullable=True),
        sa.Column('scrap_type', sa.String(50), nullable=False),
        sa.Column('weight_kg', sa.Float(), nullable=False),
        sa.Column('copper_content_kg', sa.Float(), nullable=True),
        sa.Column('copper_percentage', sa.Float(), nullable=True),
        sa.Column('lme_price_at_entry', sa.Float(), nullable=True),
        sa.Column('financial_value', sa.Float(), nullable=True),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('reported_by', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id']),
        sa.ForeignKeyConstraint(['work_order_id'], ['work_orders.id']),
        sa.ForeignKeyConstraint(['reported_by'], ['employees.id'])
    )

    # Create maintenance_tasks table
    op.create_table(
        'maintenance_tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('task_number', sa.String(50), nullable=False),
        sa.Column('machine_id', sa.Integer(), nullable=False),
        sa.Column('maintenance_type', sa.String(20), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('priority', sa.String(20), default='medium'),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('assigned_to', sa.Integer(), nullable=True),
        sa.Column('scheduled_date', sa.DateTime(), nullable=True),
        sa.Column('completed_date', sa.DateTime(), nullable=True),
        sa.Column('estimated_duration_hours', sa.Float(), nullable=True),
        sa.Column('actual_duration_hours', sa.Float(), nullable=True),
        sa.Column('parts_used', sa.Text(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('task_number'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id']),
        sa.ForeignKeyConstraint(['assigned_to'], ['employees.id'])
    )

    # Create emulsion_logs table
    op.create_table(
        'emulsion_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('machine_id', sa.Integer(), nullable=False),
        sa.Column('concentration', sa.Float(), nullable=False),
        sa.Column('ph_level', sa.Float(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('action_taken', sa.Text(), nullable=True),
        sa.Column('recorded_by', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id']),
        sa.ForeignKeyConstraint(['recorded_by'], ['employees.id'])
    )

    # Create workforce_records table
    op.create_table(
        'workforce_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('record_date', sa.Date(), nullable=False),
        sa.Column('shift', sa.String(1), nullable=False),
        sa.Column('plant_id', sa.Integer(), nullable=True),
        sa.Column('department', sa.String(50), nullable=True),
        sa.Column('total_employees', sa.Integer(), nullable=False),
        sa.Column('present', sa.Integer(), nullable=False),
        sa.Column('absent', sa.Integer(), default=0),
        sa.Column('on_leave', sa.Integer(), default=0),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['plant_id'], ['plants.id'])
    )

    # Create daily_production table
    op.create_table(
        'daily_production',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('production_date', sa.Date(), nullable=False),
        sa.Column('plant_id', sa.Integer(), nullable=True),
        sa.Column('machine_id', sa.Integer(), nullable=True),
        sa.Column('shift', sa.String(1), nullable=True),
        sa.Column('target_quantity', sa.Float(), nullable=True),
        sa.Column('actual_quantity', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(20), default='meters'),
        sa.Column('oee', sa.Float(), nullable=True),
        sa.Column('availability', sa.Float(), nullable=True),
        sa.Column('performance', sa.Float(), nullable=True),
        sa.Column('quality_rate', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['plant_id'], ['plants.id']),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'])
    )

    # Create indexes for better query performance
    op.create_index('ix_machines_plant_id', 'machines', ['plant_id'])
    op.create_index('ix_machines_status', 'machines', ['status'])
    op.create_index('ix_production_logs_machine_id', 'production_logs', ['machine_id'])
    op.create_index('ix_production_logs_log_date', 'production_logs', ['log_date'])
    op.create_index('ix_work_orders_machine_id', 'work_orders', ['machine_id'])
    op.create_index('ix_work_orders_status', 'work_orders', ['status'])
    op.create_index('ix_downtime_logs_machine_id', 'downtime_logs', ['machine_id'])
    op.create_index('ix_maintenance_tasks_machine_id', 'maintenance_tasks', ['machine_id'])
    op.create_index('ix_maintenance_tasks_status', 'maintenance_tasks', ['status'])
    op.create_index('ix_scrap_entries_machine_id', 'scrap_entries', ['machine_id'])
    op.create_index('ix_daily_production_date', 'daily_production', ['production_date'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_daily_production_date', 'daily_production')
    op.drop_index('ix_scrap_entries_machine_id', 'scrap_entries')
    op.drop_index('ix_maintenance_tasks_status', 'maintenance_tasks')
    op.drop_index('ix_maintenance_tasks_machine_id', 'maintenance_tasks')
    op.drop_index('ix_downtime_logs_machine_id', 'downtime_logs')
    op.drop_index('ix_work_orders_status', 'work_orders')
    op.drop_index('ix_work_orders_machine_id', 'work_orders')
    op.drop_index('ix_production_logs_log_date', 'production_logs')
    op.drop_index('ix_production_logs_machine_id', 'production_logs')
    op.drop_index('ix_machines_status', 'machines')
    op.drop_index('ix_machines_plant_id', 'machines')

    # Drop tables in reverse order of creation (to handle foreign keys)
    op.drop_table('daily_production')
    op.drop_table('workforce_records')
    op.drop_table('emulsion_logs')
    op.drop_table('maintenance_tasks')
    op.drop_table('scrap_entries')
    op.drop_table('quality_checks')
    op.drop_table('downtime_logs')
    op.drop_table('production_logs')
    op.drop_table('work_orders')
    op.drop_table('employees')
    op.drop_table('machines')
    op.drop_table('plants')
    op.drop_table('users')
