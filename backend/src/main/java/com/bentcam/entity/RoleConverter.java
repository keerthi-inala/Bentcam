package com.bentcam.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {
    @Override
    public String convertToDatabaseColumn(Role role) {
        return role == null ? null : role.name().toLowerCase();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        String normalized = dbData.trim().toLowerCase();
        switch (normalized) {
            case "admin": return Role.ADMIN;
            case "user": return Role.USER;
            default:
                throw new IllegalArgumentException("Unknown role value: " + dbData);
        }
    }
}
