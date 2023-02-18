import styles from "./MainLayout.module.scss";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const MainLayout: React.FC<Props> = ({
  children,
  className,
  containerClassName,
}) => {
  return (
    <section className={clsx(styles.container, containerClassName)}>
      <header>
        <nav>
          <div className={styles.logo}>IET DAVV</div>
          <ul>
            <li>Attendance Portal</li>
          </ul>
        </nav>
      </header>
      <main className={className}>{children}</main>
    </section>
  );
};

export default MainLayout;
