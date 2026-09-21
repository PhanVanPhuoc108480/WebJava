USE quanlysinhvien;
GO

-- Xóa bảng cũ nếu đã tồn tại
IF OBJECT_ID('dbo.students', 'U') IS NOT NULL
    DROP TABLE dbo.students;
GO

-- Tạo bảng students
CREATE TABLE [dbo].[students](
    [id] [uniqueidentifier] NOT NULL,
    [student_code] [nvarchar](50) NOT NULL,
    [full_name] [nvarchar](255) NOT NULL,
    [email] [nvarchar](255) NOT NULL,
    [phone] [varchar](255) NULL,
    [class_name] [varchar](255) NULL,
    PRIMARY KEY ([id])
);
GO
INSERT INTO dbo.students
(id, student_code, full_name, email, phone, class_name)
VALUES
(NEWID(), N'SV001', N'Nguyễn Văn A', N'vana@gmail.com', '0901234567', 'C2024A'),
(NEWID(), N'SV002', N'Trần Thị B', N'thib@gmail.com', '0912345678', 'C2024B'),
(NEWID(), N'SV003', N'Lê Văn C', N'levanc@gmail.com', '0923456789', 'C2024C'),
(NEWID(), N'SV004', N'Phạm Minh Dũng', N'minhdung@gmail.com', '0933456789', 'C2024A'),
(NEWID(), N'SV005', N'Hoàng Thị Em', N'hoangem@gmail.com', '0944567890', 'C2024B'),
(NEWID(), N'SV006', N'Vũ Đức F', N'vuducf@gmail.com', '0955678901', 'C2024C'),
(NEWID(), N'SV007', N'Đặng Nhật Anh', N'nhatanh@gmail.com', '0966789012', 'C2024A'),
(NEWID(), N'SV008', N'Bùi Thảo H', N'buihao@gmail.com', '0977890123', 'C2024B'),
(NEWID(), N'SV009', N'Ngô Quốc I', N'ngoquoc@gmail.com', '0988901234', 'C2024C'),
(NEWID(), N'SV010', N'Mai Lan K', N'mailank@gmail.com', '0999012345', 'C2024A');
GO
SELECT COUNT(*) AS SoLuongSinhVien
FROM dbo.students;