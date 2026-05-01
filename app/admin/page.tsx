"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Order = {
  id: string;
  created_at: string;
  table_number: string;
  items: string;
  total: string;
  status: string;
};

export default function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#030712", color: "white", padding: "24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ color: "#FB923C", fontSize: "28px", fontWeight: "bold" }}>Admin Panel</h1>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>Brim Restaurant — Live Orders</p>
          </div>
          <button onClick={fetchOrders} style={{
            backgroundColor: "#1F2937", color: "#FB923C", padding: "10px 16px",
            borderRadius: "10px", border: "1px solid #FB923C", cursor: "pointer", fontSize: "14px"
          }}>Refresh</button>
        </div>

        {loading ? (
          <p style={{ color: "#9CA3AF" }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "#9CA3AF" }}>No orders yet.</p>
        ) : (
          orders.map(order => {
            const items = JSON.parse(order.items);
            return (
              <div key={order.id} style={{
                backgroundColor: "#111827", borderRadius: "16px", padding: "20px",
                marginBottom: "16px", border: "1px solid #374151"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <p style={{ color: "#FB923C", fontWeight: "bold", fontSize: "18px" }}>
                      Table {order.table_number}
                    </p>
                    <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      backgroundColor: order.status === "done" ? "#065F46" : order.status === "preparing" ? "#92400E" : "#1F2937",
                      color: order.status === "done" ? "#6EE7B7" : order.status === "preparing" ? "#FCD34D" : "#9CA3AF",
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold"
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #374151", paddingTop: "12px", marginBottom: "12px" }}>
                  {items.map((item: any) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <p style={{ color: "white", fontSize: "14px" }}>{item.name} x{item.quantity}</p>
                      <p style={{ color: "#FB923C", fontSize: "14px" }}>Rs. {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "#FB923C", fontWeight: "bold", fontSize: "16px" }}>{order.total}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => updateStatus(order.id, "preparing")} style={{
                      backgroundColor: "#92400E", color: "#FCD34D", padding: "8px 14px",
                      borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold"
                    }}>Preparing</button>
                    <button onClick={() => updateStatus(order.id, "done")} style={{
                      backgroundColor: "#065F46", color: "#6EE7B7", padding: "8px 14px",
                      borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold"
                    }}>Done</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}