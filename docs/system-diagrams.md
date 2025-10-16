# InventoryPro System Diagrams

## User Journey Flow

```mermaid
graph TD
    A[User Login] --> B{Role Check}
    B -->|Administrator| C[Full Access]
    B -->|Manager| D[Management Access]
    B -->|Staff| E[Operational Access]
    B -->|Auditor| F[Read-Only Access]
    
    C --> G[Dashboard]
    D --> G
    E --> G
    F --> G
    
    G --> H[Product Catalog]
    G --> I[Inventory Overview]
    G --> J[Procurement]
    G --> K[Sales]
    G --> L[Warehouses]
    G --> M[Analytics]
    
    J --> N[Create PO]
    N --> O[Approve PO]
    O --> P[Receive Goods]
    P --> I
    
    K --> Q[Create Sales Order]
    Q --> R[Reserve Stock]
    R --> S[Generate Invoice]
    S --> T[Dispatch]
    T --> I
    
    I --> U[Stock Adjustment]
    I --> V[Stock Transfer]
    I --> W[Low Stock Alerts]
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ PURCHASE_ORDER : creates
    USER ||--o{ SALES_ORDER : creates
    USER {
        string id PK
        string email
        string name
        string role
        string password
        date createdAt
    }
    
    PRODUCT ||--o{ INVENTORY : tracks
    PRODUCT ||--o{ PO_ITEM : includes
    PRODUCT ||--o{ SO_ITEM : includes
    PRODUCT }o--|| VENDOR : supplies
    PRODUCT {
        string id PK
        string sku UK
        string name
        string barcode
        string category
        number price
        string vendorId FK
        string description
    }
    
    VENDOR ||--o{ PRODUCT : supplies
    VENDOR ||--o{ PURCHASE_ORDER : receives
    VENDOR {
        string id PK
        string name
        string contactPerson
        string email
        string phone
        string address
        string gstin
        string status
        array orderHistory
    }
    
    CUSTOMER ||--o{ SALES_ORDER : places
    CUSTOMER {
        string id PK
        string name
        string contactPerson
        string email
        string phone
        string address
        string gstin
        string status
    }
    
    PURCHASE_ORDER ||--|{ PO_ITEM : contains
    PURCHASE_ORDER {
        string id PK
        string poNumber UK
        string vendorId FK
        string status
        number totalAmount
        date orderDate
        date expectedDelivery
        string createdBy FK
    }
    
    PO_ITEM {
        string id PK
        string poId FK
        string productId FK
        number quantity
        number unitPrice
        number total
    }
    
    SALES_ORDER ||--|{ SO_ITEM : contains
    SALES_ORDER {
        string id PK
        string soNumber UK
        string customerId FK
        string status
        number totalAmount
        date orderDate
        date deliveryDate
        string createdBy FK
    }
    
    SO_ITEM {
        string id PK
        string soId FK
        string productId FK
        number quantity
        number unitPrice
        number discount
        number total
    }
    
    WAREHOUSE ||--o{ INVENTORY : stores
    WAREHOUSE ||--o{ STOCK_TRANSFER : involves
    WAREHOUSE {
        string id PK
        string name
        string location
        string manager
        number capacity
        string status
    }
    
    INVENTORY }o--|| PRODUCT : references
    INVENTORY }o--|| WAREHOUSE : locatedIn
    INVENTORY {
        string id PK
        string productId FK
        string warehouseId FK
        number quantity
        number reorderLevel
        number maxLevel
        string location
        date lastUpdated
    }
    
    STOCK_TRANSFER {
        string id PK
        string productId FK
        string fromWarehouseId FK
        string toWarehouseId FK
        number quantity
        string status
        date transferDate
        string initiatedBy FK
    }
    
    BATCH_TRACKING {
        string id PK
        string productId FK
        string batchNumber
        date manufactureDate
        date expiryDate
        number quantity
        string warehouseId FK
    }
```

## Stock Replenishment Process

```mermaid
sequenceDiagram
    participant S as System
    participant M as Manager
    participant V as Vendor
    participant W as Warehouse
    
    S->>M: Low Stock Alert
    M->>S: Create Purchase Order
    M->>S: Approve PO
    S->>V: Send PO
    V->>W: Deliver Goods
    W->>S: Create GRN (Goods Receipt)
    S->>S: Update Inventory
    S->>M: Notify Completion
```

## Order Fulfillment Process

```mermaid
sequenceDiagram
    participant C as Customer
    participant S as Staff
    participant SYS as System
    participant W as Warehouse
    
    C->>S: Place Order
    S->>SYS: Create Sales Order
    SYS->>SYS: Check Stock Availability
    SYS->>SYS: Reserve Stock
    S->>SYS: Generate Invoice
    W->>W: Pick & Pack
    W->>C: Dispatch Goods
    SYS->>SYS: Update Inventory
    SYS->>S: Mark as Delivered
```

## How to Use These Diagrams

You can use this mermaid code in:
- **Mermaid Live Editor**: https://mermaid.live
- **GitHub**: Paste in markdown files (GitHub renders mermaid)
- **Notion**: Supports mermaid diagrams
- **VS Code**: Use Mermaid preview extensions
- **Draw.io**: Import mermaid code
- **Documentation sites**: Most support mermaid syntax

To export as images:
1. Visit https://mermaid.live
2. Paste the code
3. Click "Actions" → "Export PNG/SVG/PDF"
