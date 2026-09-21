package com.example.student;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentPageController {

    @GetMapping("/students")
    public String studentsPage() {
        return "students";
    }
}