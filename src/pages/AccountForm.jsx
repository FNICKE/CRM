import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addAccount, updateAccount } from '../features/accounts/accountsSlice';
import { Save, Globe, Phone, Mail, Building2, ToggleLeft, MessageSquare, RefreshCw } from 'lucide-react';

const schema = yup.object({
  name: yup.string().required("Account name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().min(10, "Phone must be at least 10 digits").required("Phone is required"),
  website: yup.string().url("Must be a valid URL").required("Website is required"),
  industry: yup.string().required("Please select an industry"),
  status: yup.string().required("Status selection is required"),
  remark: yup.string().max(200, "Remark is too long"),
}).required();

const AccountForm = ({ existingData, onSuccess }) => {
  const dispatch = useDispatch();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: "active" }
  });

  useEffect(() => {
    if (existingData) {
      reset({
        ...existingData,
        status: existingData.status ? "active" : "inactive"
      });
    } else {
      reset({ name: '', email: '', phone: '', website: '', industry: '', status: 'active', remark: '' });
    }
  }, [existingData, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      status: data.status === "active"
    };

    if (existingData) {
      dispatch(updateAccount({ ...payload, id: existingData.id }));
      alert("Account details updated successfully.");
    } else {
      dispatch(addAccount(payload));
      alert("Account successfully registered.");
    }
    
    reset();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <Building2 size={14} /> Account Name *
          </label>
          <input 
            {...register("name")} 
            placeholder="Acme Corp" 
            className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <Mail size={14} /> Email Address *
          </label>
          <input 
            {...register("email")} 
            placeholder="contact@acme.com" 
            className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <Phone size={14} /> Phone No. *
          </label>
          <input 
            {...register("phone")} 
            placeholder="+1 555 000 000" 
            className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <Globe size={14} /> Website *
          </label>
          <input 
            {...register("website")} 
            placeholder="https://example.com" 
            className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
          />
          {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <Building2 size={14} /> Industry *
          </label>
          <select 
            {...register("industry")} 
            className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Media">Media</option>
          </select>
          {errors.industry && <p className="text-red-600 text-xs mt-1">{errors.industry.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <ToggleLeft size={14} /> Status *
          </label>
          <select 
            {...register("status")} 
            className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Remarks */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
          <MessageSquare size={14} /> Remark
        </label>
        <textarea 
          {...register("remark")} 
          rows="3" 
          placeholder="Add internal notes..." 
          className="border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
        />
        {errors.remark && <p className="text-red-600 text-xs mt-1">{errors.remark.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t">
        <button 
          type="submit" 
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 hover:bg-gray-900 text-sm font-medium"
        >
          {existingData ? (
            <>
              <RefreshCw size={16} /> Update
            </>
          ) : (
            <>
              <Save size={16} /> Save
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;