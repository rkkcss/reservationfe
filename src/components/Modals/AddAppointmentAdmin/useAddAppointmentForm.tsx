import { useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useAppSelector } from '../../../store/hooks';
import { Guest } from '../../../helpers/types/Guest';
import { Offering } from '../../../helpers/types/Offering';
import { BusinessEmployee } from '../../../helpers/types/BusinessEmployee';
import { getAllGuestsBySearch } from '../../../helpers/queries/guest-queries';
import { getOfferingByLoggedInEmployee } from '../../../helpers/queries/offering-queries';
import { getEmployeesByBusinessId } from '../../../helpers/queries/business-employee';
import { CreateAdminAppointmentRequest, Appointment } from '../../../helpers/types/Appointment';

export const useAppointmentForm = (appointment: Appointment | CreateAdminAppointmentRequest | undefined, open: boolean, onClose: () => void, onOk?: (values: CreateAdminAppointmentRequest) => void) => {
  const [form] = Form.useForm();
  const [searchedGuests, setSearchedGuests] = useState<Guest[]>([]);
  const [offers, setOffers] = useState<Offering[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<BusinessEmployee[]>([]);
  const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);

  const searchInGuests = (value: string) => {
    getAllGuestsBySearch(Number(selectedBusinessEmployee?.business.id), value).then((res) => {
      setSearchedGuests(res.data);
    });
  };

  const getAllOffers = useCallback(() => {
    getOfferingByLoggedInEmployee(Number(selectedBusinessEmployee?.business.id)).then((res) => {
      setOffers(res);
    });
  }, [selectedBusinessEmployee]);

  const getEmployeeOptions = () => {
    if (employeeOptions.length > 0) return;
    getEmployeesByBusinessId(Number(selectedBusinessEmployee?.business.id)).then((res) => {
      setEmployeeOptions(res.data);
    });
  };

  const mergeEntity = useCallback(<T extends { id: number | null }>(
    entity: T | undefined,
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    formKey: string
  ) => {
    if (!entity) return;
    setList((prev) => {
      const exists = prev.some(item => item.id === entity.id);
      return exists ? prev : [entity, ...prev];
    });
    form.setFieldsValue({ [formKey]: entity.id });
  }, [form]);

  useEffect(() => {
    if (open) {
      getAllOffers();
      form.setFieldsValue(appointment);
    } else {
      form.resetFields();
    }
  }, [open, getAllOffers, form, appointment]);

  // useAppointmentForm.ts javítása

  useEffect(() => {
    mergeEntity(appointment?.guest, setSearchedGuests, 'guestId');
    mergeEntity(appointment?.offering, setOffers, 'offeringId');

    if (appointment?.businessEmployee) {
      setEmployeeOptions((prev) => {
        const exists = prev.some(item => item.id === appointment.businessEmployee?.id);
        return exists ? prev : [appointment.businessEmployee!, ...prev];
      });

      form.setFieldsValue({
        employeeId: appointment.businessEmployee.user.id,
      });
    }
  }, [appointment, form, mergeEntity]);

  const handleOnFinish = (values: CreateAdminAppointmentRequest) => {
    if (onOk) {
      onOk(values);
      onClose();
    }
  };

  return {
    form,
    searchedGuests,
    offers,
    employeeOptions,
    searchInGuests,
    getEmployeeOptions,
    handleOnFinish,
    mergeEntity,
    setSearchedGuests
  };
};