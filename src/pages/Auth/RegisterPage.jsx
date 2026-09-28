import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";

const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, "Escribe tu nombre."),
    email: z.string().email("Escribe un email válido."),
    password: z
      .string()
      .min(8, "Usa al menos 8 caracteres.")
      .regex(/[A-Z]/, "Incluye una mayúscula.")
      .regex(/[0-9]/, "Incluye un número."),
    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden.",
  });

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(registerSchema), mode: "onChange" });

  const onSubmit = async (values) => {
    const payload = {
      displayName: values.displayName,
      email: values.email,
      password: values.password,
    };
    try {
      await registerUser(payload);
      toast.success("Cuenta creada. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "No pudimos crear tu cuenta.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-content">
        <p className="eyebrow">Tu cuenta</p>
        <h1>Haz espacio para lo esencial.</h1>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="displayName">Nombre</label>
          <input id="displayName" {...register("displayName")} />
          {errors.displayName && (
            <span className="form-error">{errors.displayName.message}</span>
          )}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}
          <label htmlFor="passwordConfirmation">Repite tu contraseña</label>
          <input
            id="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            {...register("passwordConfirmation")}
          />
          {errors.passwordConfirmation && (
            <span className="form-error">
              {errors.passwordConfirmation.message}
            </span>
          )}
          <button
            className="button button-dark"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
