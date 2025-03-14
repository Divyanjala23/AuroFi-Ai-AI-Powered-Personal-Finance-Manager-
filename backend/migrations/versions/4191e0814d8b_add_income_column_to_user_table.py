"""Add income column to user table

Revision ID: 4191e0814d8b
Revises: 0dccd5acff5f
Create Date: 2025-02-26 22:42:43.177020

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4191e0814d8b'
down_revision = '0dccd5acff5f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('budget', schema=None) as batch_op:
        batch_op.add_column(sa.Column('income_percentage', sa.Float(), nullable=False))

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('income', sa.Float(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('income')

    with op.batch_alter_table('budget', schema=None) as batch_op:
        batch_op.drop_column('income_percentage')

    # ### end Alembic commands ###
