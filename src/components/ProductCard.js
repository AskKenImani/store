import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <Link to={`/product/${product._id}`} className={styles.thumbWrap}>
        <img src={product.imageUrl} alt={product.name} className={styles.thumb} />
      </Link>
      <div className={styles.body}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.meta}>
          <span className={styles.price}>₦{Number(product.price).toLocaleString()}</span>
          <span className={styles.uploader}>By {product.uploadedBy}</span>
        </div>
        <Link to={`/product/${product._id}`} className={styles.viewBtn}>View</Link>
      </div>
    </div>
  );
}
