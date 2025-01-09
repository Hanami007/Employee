<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;


use function Illuminate\Events\queueable;

class EmployeeControllers extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search');
        $search = $request->input('search', '');
        $filterBy = $request->input('filterBy', 'first_name');
        $employees = Employee::when($search, function ($query, $search) use ($filterBy) {
            $query->where($filterBy, 'like', "%{$search}%");
        })->paginate(10);

        // $employees = DB::table('employees')
        //     ->where('first_name', 'like', '%' . $query . '%')
        //     ->orWhere('last_name', 'like', '%' . $query . '%')
        //     ->paginate(10);

        return inertia('Employees/Index', [
        'employees' => $employees,
        'query' => $search,
        'filterBy' => $filterBy,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        return inertia('Employees/Create', ['departments' => $departments]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|string|max:1',
            'birth_date' => 'required|date',
            'hire_date' => 'required|date',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // 1. หาค่า emp_no ล่าสุด
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
                $newEmpNo = $latestEmpNo + 1; // เพิ่มค่า emp_no ทีละ 1

                Log::info("New Employee Number: " . $newEmpNo);

                // 2. เพิ่มข้อมูลลงในฐานข้อมูลอย่างถูกต้อง
                DB::table("employees")->insert([
                    "emp_no"     => $newEmpNo,
                    "first_name" => $validated['first_name'],
                    "last_name"  => $validated['last_name'],
                    "gender"     => $validated['gender'],
                    "birth_date" => $validated['birth_date'],
                    "hire_date"  => $validated['hire_date'],
                ]);
            });

            // ส่งข้อความตอบกลับเมื่อสำเร็จ
            return redirect()->route('employees.index')
                ->with('success', 'Employee created successfully.');
        } catch (\Exception $e) {
            Log::error('Employee creation failed: ' . $e->getMessage());

            // ส่งข้อความตอบกลับเมื่อไม่สำเร็จ
            return redirect()->route('employees.index')
                ->with('error', 'Employee creation failed.');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
