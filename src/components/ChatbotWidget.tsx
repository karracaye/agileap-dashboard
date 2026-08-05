import Image from "next/image";
import styles from "./ChatbotWidget.module.css";

export default function ChatbotWidget() {
  return (
    <div className={styles.widget}>
      <Image
        src="/sam-chatbot.gif"
        alt="AgileAP chatbot assistant"
        width={150}
        height={150}
        className={styles.avatar}
        unoptimized
        priority
      />
    </div>
  );
}
