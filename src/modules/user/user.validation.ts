import { z } from 'zod';

const fullNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'FirstName is required')
    .max(30, 'FirstName should not be more than 30 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'LastName is required')
    .max(30, 'LastName should not be more than 30 characters'),
});

const AddressValidationSchema = z.object({
  street: z.string().trim().min(1, 'Street is required'),
  city: z.string().trim().min(1, 'City is required'),
  country: z.string().trim().min(1, 'Country is required'),
});

const OrderValidationSchema = z.object({
  productName: z.string().trim().min(1, 'ProductName is required'),
  price: z.number({
    invalid_type_error: 'Price should be a number',
    required_error: 'Price is required',
  }),
  quantity: z
    .number({
      invalid_type_error: 'Quantity should be a number',
      required_error: 'Quantity is required',
    })
    .min(1, 'Quantity is required'),
});

export const UserValidationSchema = z.object({
  userId: z.number({
    invalid_type_error: 'User ID should be a number',
    required_error: 'User ID is required',
  }),
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().trim().min(1, 'Password is required'),
  fullName: fullNameValidationSchema,
  age: z.number({
    invalid_type_error: 'Age should be a number',
    required_error: 'Age is required',
  }),
  email: z
    .string({
      invalid_type_error: 'Email should be a string',
      required_error: 'Email is required',
    })
    .email('Invalid email'),
  isActive: z.boolean().default(true),
  hobbies: z.array(z.string()).default([]),
  address: AddressValidationSchema,
  orders: z.array(OrderValidationSchema).default([]),
  dateCreated: z
    .union([z.date(), z.string()])
    .transform((val) => new Date(val))
    .default(new Date()),
  createdBy: z.string().default(''),
  dateModified: z.date().optional(),
  modifiedBy: z.string().optional(),
  isDeleted: z.boolean().default(false),
});
