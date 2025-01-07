import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ employees, query, filterBy }) {
    const [search, setSearch] = useState(query || "");
    const [searchBy, setSearchBy] = useState(filterBy || "first_name");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/employees", { search, filterBy: searchBy });
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold text-center mb-6">รายชื่อพนักงาน</h1>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row items-center gap-4 mb-6"
                >
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
                    >
                        <option value="first_name">secret all</option>
                        <option value="last_name">secret LastName</option>
                        <option value="emp_no">ค้นหาจาก ID</option>
                    </select>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="search"
                        className="border border-gray-300 rounded-md p-2 w-full md:flex-1"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                    >
                        submit
                    </button>
                </form>

                {/* Employee Table */}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">First Name</th>
                                <th className="border border-gray-300 px-4 py-2">Last Name</th>
                                <th className="border border-gray-300 px-4 py-2">Gender</th>
                                <th className="border border-gray-300 px-4 py-2">Birth Day</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.data.length > 0 ? (
                                employees.data.map((employee, index) => (
                                    <tr
                                        key={index}
                                        className={`${
                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                    >
                                        <td className="border border-gray-300 px-4 py-2">
                                            {employee.emp_no}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {employee.first_name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {employee.last_name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {employee.gender === "M" ? "ชาย" : "หญิง"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        <td>{employee.birth_date}</td>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-gray-500 py-4"
                                    >
                                        ไม่พบข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-4 space-x-2">
                    {employees.links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            className={`px-3 py-1 border rounded-md ${
                                link.active
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-blue-500 border-blue-500"
                            } hover:bg-blue-600 hover:text-white`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

