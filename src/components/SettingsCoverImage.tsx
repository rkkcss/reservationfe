import { Button, Form, Modal, notification, Upload } from 'antd'
import { API } from '../utils/API'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { CiEdit } from 'react-icons/ci'
import placeholderImage from '../assets/placeholder.jpg'
import { useForm } from 'antd/es/form/Form'
import { changeBusinessLogo } from '../helpers/queries/business-queries'
import type { UploadRequestOption } from 'rc-upload/lib/interface';

type SettingsCoverImageProps = {
    imageURL: string,
    setBusinessLogo: (logo: string) => void,
}

const SettingsCoverImage = ({ imageURL, setBusinessLogo }: SettingsCoverImageProps) => {
    const [form] = useForm();

    const handleUploadImage = async ({ file, onSuccess, onError }: UploadRequestOption) => {
        const formData = new FormData();
        formData.append('file', file);

        await API.post("/api/image/upload", formData).then(res => {
            setBusinessLogo(res.data)
            form.setFieldValue("logo", res.data)
            onSuccess?.(res);
        }).catch(err => {
            onError?.(err);
            notification.error({ message: err?.response?.data })
        });
    }

    const handleDeleteImage = () => {
        Modal.confirm({
            title: "Biztosan szeretnéd törölni?",
            className: "top-48",
            okText: "Törlés",
            cancelText: "Mégsem",
            okButtonProps: { danger: true }
        })
    }

    const handleLogoForm = (e: { logo: string }) => {
        changeBusinessLogo(e).then(() => {
            notification.success({ message: "Sikeres borítókép módosítás!", placement: "bottom" })
        })
    }
    return (
        <Form onFinish={handleLogoForm} form={form}>
            <Form.Item name="logo">
                <div className="relative group">
                    <p className="text-lg mb-2 mt-4 font-semibold">Borítókép módosítás</p>
                    <img onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholderImage;
                    }}
                        src={imageURL || placeholderImage} className="w-full h-[35vh] object-cover rounded-lg group-hover:opacity-60 group-hover:blur-sm transition-all duration-500" />
                    <div className="absolute top-0 justify-center items-center w-full h-full gap-4 group-hover:flex hidden">
                        <Upload name="file" customRequest={(e: UploadRequestOption) => handleUploadImage(e)} showUploadList={false}>
                            <Button icon={<CiEdit />} type="primary">Kép módosítás</Button>
                        </Upload>
                        <Button icon={<RiDeleteBin5Line />} danger type="primary" onClick={handleDeleteImage}>Kép törlése</Button>
                    </div>
                </div>
            </Form.Item>
            <Button type="primary" htmlType="submit">Mentés</Button>
        </Form>
    )
}

export default SettingsCoverImage