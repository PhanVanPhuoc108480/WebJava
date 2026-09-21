package com.example.student.repository;

import com.example.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {

    // Tìm chính xác theo mã sinh viên
    Optional<Student> findByStudentCode(String studentCode);

    // Tìm kiếm theo mã, tên, email, số điện thoại
    List<Student> findByStudentCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String studentCode,
            String fullName,
            String email,
            String phone
    );

    // Lấy danh sách theo mã SV tăng dần
    List<Student> findAllByOrderByStudentCodeAsc();
}