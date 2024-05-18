"use client";
import { AuthUserWithSidebarOptions } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { getAuthUserDetails, upsertUser, updateUser } from "@/lib/queries";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Input } from "../ui/input";

type Props = {
  userData?: Partial<User>;
  editing?: boolean;
};

const UserDetails = ({ userData, editing }: Props) => {
  const { data, setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
    },
  });

  const userDescription = editing
    ? "Update your information"
    : "Finish setting up your account. You can update your information later from the settings tab.";

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [userData, data, form]);

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    try {
      let customerId;

      if (!data?.user?.id) {
        const bodyData = {
          name: values.name,
          email: values.email,
          avatarUrl: values.avatarUrl,
        };
        const customerResponse = await fetch("/api/stripe/create-customer", {
          method: "POST",
          body: JSON.stringify(bodyData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const customerData: { customerId: string } =
          await customerResponse.json();
        customerId = customerData.customerId;
      }
      if (!data?.user?.customerId && !customerId) return;
      const newUserData = await upsertUser({
        name: values.name,
        email: values.email,
        avatarUrl: values.avatarUrl,
        customerId: customerId,
      });

      if (newUserData) {
        toast({
          title: "Success",
          description: "Update User Information",
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Oppse!",
          description: "Could not update user information",
        });
      }
    } catch (error) {
      console.error("Error updating user information", error);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>{userDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={form.formState.isSubmitting}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isLoading ? <Loading /> : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
