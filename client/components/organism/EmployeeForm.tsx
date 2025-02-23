import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";

const formSchema = z.object({
  firstName: z.string(),
  age: z.number().optional(),
});

const defaultValues = {
  firstName: "",
  age: undefined,
};

const formData = [
  { title: "name", label: "Name", type: "text" },
  { title: "employeeId", label: "Employee ID", type: "number" },
  { title: "department", label: "Department", type: "text" },
  { title: "email", label: "Email", type: "email" },
  { title: "phone", label: "Phone", type: "tel" },
  { title: "address", label: "Address", type: "text" },
  { title: "dateOfBirth", label: "Date of Birth", type: "date" },
];

const EmployeeForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form Values:", values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formData.map((item) => (
          <FormField
            key={item.title}
            control={form.control}
            name={item.title as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <Input
                    type={item.type === "number" ? "number" : item.type}
                    placeholder={`Enter ${item.label}`}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <SheetFooter>
          <SheetClose>
            <Button type="submit">Save</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default EmployeeForm;