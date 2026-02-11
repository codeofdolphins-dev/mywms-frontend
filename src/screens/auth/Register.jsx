import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { useForm } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import Input from '../../components/inputs/Input';
import { Button } from '@mantine/core';

const Register = () => {
    const navigate = useNavigate();

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster()

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            c_password: "",
        }
    });

    const password = watch("password");

    async function formSubmit(data) {
        try {
            const res = await createData({ path: "/auth/register-new-company", formData: data });
            if (res.success) {
                reset();
                navigate("/auth/login");
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Company Register</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to register</p>
                            </div>

                            <form onSubmit={handleSubmit(formSubmit)} className="space-y-5 dark:text-white" >
                                <Input
                                    label="Name"
                                    labelcolor={"black"}
                                    placeholder="Enter Company Name"
                                    Icon={IconUser}
                                    fieldColor={"text-white-dark"}
                                    className={"form-input placeholder:text-white-dark"}
                                    {...register("name", { required: "Company name is required!!!" })}
                                    error={errors.name?.message}
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    labelcolor={"black"}
                                    placeholder="Enter Company Email"
                                    Icon={IconMail}
                                    fieldColor={"text-white-dark"}
                                    className={"form-input placeholder:text-white-dark"}
                                    {...register("email", { required: "email is required!!!" })}
                                    error={errors.email?.message}
                                />
                                <Input
                                    type="password"
                                    label="Password"
                                    labelcolor={"black"}
                                    placeholder="Enter Password"
                                    Icon={IconLockDots}
                                    fieldColor={"text-white-dark"}
                                    className={"form-input placeholder:text-white-dark"}
                                    {...register("password", { required: "confirm password is required!!!" })}
                                    error={errors.password?.message}
                                />
                                <Input
                                    type="password"
                                    label="Confirm Password"
                                    labelcolor={"black"}
                                    placeholder="Enter Confirm Password"
                                    Icon={IconLockDots}
                                    fieldColor={"text-white-dark"}
                                    className={"form-input placeholder:text-white-dark"}
                                    {...register("c_password", {
                                        required: "confirm password is required!!!",
                                        validate: (value) =>
                                            value === password || "Passwords do not match!!!",
                                    })}
                                    error={errors.c_password?.message}
                                />
                                <Button
                                    type="submit"
                                    className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                    loading={createPending}
                                >
                                    Register
                                </Button>
                            </form>

                            <div className="text-center dark:text-white mt-3">
                                Already have an account ?&nbsp;
                                <Link to="/auth/login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    LOG IN
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
