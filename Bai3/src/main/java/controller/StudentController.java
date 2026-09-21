package com.example.student.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.student.entity.Student;
import com.example.student.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Lấy tất cả sinh viên
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAll();
    }

    // Lấy sinh viên theo ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable UUID id) {
        return studentService.getById(id);
    }

    // Tìm theo mã sinh viên
    @GetMapping("/code/{code}")
    public Student getStudentByCode(@PathVariable String code) {
        return studentService.getByStudentCode(code);
    }

    // Tìm kiếm sinh viên
    @GetMapping("/search")
    public List<Student> searchStudents(
            @RequestParam(required = false, defaultValue = "") String keyword) {
        return studentService.search(keyword);
    }

    // Thêm sinh viên
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.save(student);
    }

    // Cập nhật sinh viên
    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable UUID id,
            @RequestBody Student student) {
        return studentService.update(id, student);
    }

    // Xóa sinh viên theo ID
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable UUID id) {
        studentService.delete(id);
        return "Đã xóa sinh viên có ID: " + id;
    }

    // Xóa tất cả sinh viên
    @DeleteMapping
    public String deleteAllStudents() {
        studentService.deleteAll();
        return "Đã xóa toàn bộ sinh viên!";
    }
}