# Generated by Django 3.1.2 on 2020-10-28 17:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('description', models.CharField(max_length=1200)),
                ('public', models.BooleanField(default=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('description', models.CharField(max_length=1200)),
                ('next', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='notes.step')),
                ('note', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='notes.note')),
            ],
        ),
        migrations.CreateModel(
            name='Element',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=2000)),
                ('next', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='notes.element')),
                ('step', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elements', to='notes.step')),
            ],
        ),
    ]
