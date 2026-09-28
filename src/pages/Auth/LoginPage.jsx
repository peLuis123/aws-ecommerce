import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { demoMode } from "../../data/demo";
import { Icon } from "../../components/ui/Icon";
import { loginRedirect } from "../../utils/loginRedirect";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Escribe un correo válido, por ejemplo nombre@correo.com."),
  password: z.string().min(1, "Escribe tu contraseña."),
});

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [demoRole, setDemoRole] = useState(null);
  const pending = useRef(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });
  const busy = isSubmitting || demoRole !== null || isLoading;
  const signIn = async (credentials, role = null) => {
    if (pending.current) return;
    pending.current = true;
    setDemoRole(role);
    clearErrors("root");
    try {
      const user = await login(credentials);
      toast.success(
        demoMode ? "Cuenta de demostración abierta" : "Sesión iniciada",
      );
      navigate(loginRedirect(user, location.state?.from), { replace: true });
    } catch (error) {
      const status = error.response?.status;
      const message =
        status === 401
          ? "El correo o la contraseña no son correctos. Revisa tus datos e inténtalo otra vez."
          : status === 429
            ? "Hubo demasiados intentos. Espera un momento antes de volver a entrar."
            : error.response?.data?.error ||
              "No pudimos conectar. Comprueba tu conexión y vuelve a intentarlo.";
      setError("root.server", { message });
    } finally {
      pending.current = false;
      setDemoRole(null);
    }
  };

  return (
    <main className="auth-page login-page">
      <div className="auth-content">
        <Link className="login-back" to="/tienda">
          <Icon name="arrow" size={15} />
          Volver a la tienda
        </Link>
        <p className="eyebrow">BIENVENIDO A CASA</p>
        <h1>
          Tu espacio
          <br />
          <em>te espera.</em>
        </h1>
        <p className="login-intro">
          Entra para ver tus pedidos y continuar con lo que te gusta.
        </p>
        {demoMode && (
          <div className="login-demo-notice">
            <Icon name="leaf" size={19} />
            <p>
              <strong>Estás explorando una demo.</strong>Los datos de este
              formulario no se validan contra una cuenta real. Puedes usar los
              accesos de prueba sin escribir tu correo ni contraseña.
            </p>
          </div>
        )}
        <form
          className="auth-form"
          noValidate
          onSubmit={(event) => handleSubmit((values) => signIn(values))(event)}
          aria-busy={busy}
        >
          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={demoMode ? "ejemplo@correo.com" : "tu@correo.com"}
              readOnly={busy}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <span id="login-email-error" className="form-error" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                readOnly={busy}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                aria-pressed={showPassword}
                aria-controls="password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <span
                id="login-password-error"
                className="form-error"
                role="alert"
              >
                {errors.password.message}
              </span>
            )}
          </div>
          <button className="button button-dark" type="submit" disabled={busy}>
            {isSubmitting
              ? "Entrando…"
              : isLoading
                ? "Comprobando sesión…"
                : demoMode
                  ? "Simular inicio de sesión"
                  : "Iniciar sesión"}
            <Icon name="arrow" size={18} />
          </button>
        </form>
        {errors.root?.server && (
          <p className="login-server-error" role="alert">
            {errors.root.server.message}
          </p>
        )}
        <p className="auth-switch">
          ¿Tu primera vez aquí? <Link to="/register">Crea tu cuenta</Link>
        </p>
        {demoMode && (
          <div className="demo-accounts">
            <p>O EXPLORA SIN COMPLETAR EL FORMULARIO</p>
            <div>
              <button
                className="button button-outline"
                type="button"
                disabled={busy}
                onClick={() => signIn({ demoRole: "buyer" }, "buyer")}
              >
                {demoRole === "buyer" ? "Abriendo…" : "Entrar como comprador"}
              </button>
              <button
                className="button button-outline"
                type="button"
                disabled={busy}
                onClick={() => signIn({ demoRole: "admin" }, "admin")}
              >
                {demoRole === "admin" ? "Abriendo…" : "Explorar administración"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
