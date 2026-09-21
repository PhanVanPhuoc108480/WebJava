package com.example.student.service;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.example.student.entity.Student;
import com.example.student.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public Student getById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));
    }

    public Student getByStudentCode(String code) {
        return studentRepository.findByStudentCode(code)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với mã: " + code));
    }

    public List<Student> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return studentRepository.findAll();
        }
        String val = keyword.trim();
        return studentRepository.findByStudentCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                val, val, val, val);
    }

    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public Student update(UUID id, Student updatedStudent) {
        Student existing = getById(id);
        existing.setStudentCode(updatedStudent.getStudentCode());
        existing.setFullName(updatedStudent.getFullName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setPhone(updatedStudent.getPhone());
        existing.setClassName(updatedStudent.getClassName());
        return studentRepository.save(existing);
    }

    public void delete(UUID id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sinh viên để xóa với ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    public void deleteAll() {
        studentRepository.deleteAll();
    }
}