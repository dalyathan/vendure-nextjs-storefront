import { Layout } from '@/src/layouts';
import { makeServerSideProps, prepareSSRRedirect } from '@/src/lib/getStatic';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React from 'react';
import { getCollections } from '@/src/graphql/sharedQueries';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { storefrontApiMutation } from '@/src/graphql/client';
import { Input } from '@/src/components/forms/Input';
import { Button } from '@/src/components/molecules/Button';
import { usePush } from '@/src/lib/redirect';
import { Absolute, Form, FormContainer, FormContent, FormWrapper } from '../components/shared';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { ErrorBanner } from '@/src/components/forms/ErrorBanner';

type FormValues = { password: string; confirmPassword: string };

const ResetPassword: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const { t } = useTranslation('customer');
    const { t: tErrors } = useTranslation('common');

    const schema = z
        .object({
            password: z
                .string()
                .min(8, tErrors('errors.password.minLength'))
                .max(25, tErrors('errors.password.maxLength')),
            confirmPassword: z
                .string()
                .min(8, tErrors('errors.password.minLength'))
                .max(25, tErrors('errors.password.maxLength')),
        })
        .refine(data => data.password === data.confirmPassword, {
            message: tErrors('errors.confirmPassword.mustMatch'),
            path: ['confirmPassword'],
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });
    const push = usePush();

    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            const { resetPassword } = await storefrontApiMutation({
                resetPassword: [
                    { password: data.password, token: props.token as string },
                    {
                        __typename: true,
                        '...on CurrentUser': { id: true },
                        '...on NativeAuthStrategyError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on NotVerifiedError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on PasswordResetTokenExpiredError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on PasswordResetTokenInvalidError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on PasswordValidationError': {
                            errorCode: true,
                            message: true,
                            validationErrorMessage: true,
                        },
                    },
                ],
            });

            if (resetPassword.__typename === 'CurrentUser') {
                push('/customer/sign-in');
                return;
            }

            setError('root', { message: tErrors(`errors.backend.${resetPassword.errorCode}`) });
        } catch {
            setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
        }
    };

    return (
        <Layout categories={props.collections}>
            <ContentContainer>
                <FormContainer>
                    <Absolute w100>
                        <ErrorBanner error={errors.root} clearErrors={() => setError('root', { message: undefined })} />
                    </Absolute>
                    <TP weight={600}>{t('resetPasswordTitle')}</TP>
                    <FormWrapper column itemsCenter gap="1.75rem">
                        <FormContent w100 column itemsCenter gap="1.75rem">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Input
                                    error={errors.password}
                                    label={t('newPassword')}
                                    type="password"
                                    {...register('password')}
                                />
                                <Input
                                    error={errors.confirmPassword}
                                    label={t('confirmNewPassword')}
                                    type="password"
                                    {...register('confirmPassword')}
                                />
                                <Button type="submit">{t('resetPassword')}</Button>
                            </Form>
                        </FormContent>
                    </FormWrapper>
                </FormContainer>
            </ContentContainer>
        </Layout>
    );
};

const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const r = await makeServerSideProps(['common', 'customer'])(context);
    const collections = await getCollections();
    const token = context.query.token as string;
    const destination = prepareSSRRedirect('/')(context);

    if (!token) return { redirect: { destination, permanent: false } };

    const returnedStuff = {
        ...r.props,
        collections,
        token,
    };

    return { props: returnedStuff };
};

export { getServerSideProps };
export default ResetPassword;
