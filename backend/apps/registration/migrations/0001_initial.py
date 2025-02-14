# Generated by Django 5.1.3 on 2025-01-22 22:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='StayOrganizer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('type', models.CharField(choices=[('person', 'Person'), ('travelAgency', 'Travel Agency'), ('employer', 'Employer')], max_length=20)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ClientData',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=50)),
                ('surname', models.CharField(max_length=50)),
                ('pesel', models.CharField(max_length=11)),
                ('phone_number', models.CharField(max_length=20)),
                ('email_address', models.EmailField(max_length=254)),
                ('address', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='common.address')),
                ('resides_in', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='common.country')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client_data', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='trip', to='registration.clientdata')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TripStage',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('arrival_date', models.DateField()),
                ('departure_date', models.DateField()),
                ('address', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='common.address')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='common.country')),
                ('stay_organizer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='registration.stayorganizer')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trip_stages', to='registration.trip')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TripWarning',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('content', models.TextField()),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='warnings', to='common.country')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
