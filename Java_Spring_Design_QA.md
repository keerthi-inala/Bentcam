# Java, Spring, and System Design Interview Q&A

This document provides concise answers to common Java, Spring, and system design questions, with real-world examples relevant to the Bentcam project.

---

### 1. Difference between WebClient and RestClient/RestTemplate
- **RestTemplate**: Synchronous, blocking HTTP client. Deprecated for new development.
- **WebClient**: Asynchronous, non-blocking, supports reactive programming. Preferred for modern Spring apps.
- **RestClient**: Newer, simpler synchronous client in Spring 6+.

**Example (Bentcam):**
- Use `WebClient` for calling external product APIs without blocking threads, improving scalability.

---

### 2. Strategy Design Pattern in APIs
- **Definition**: Encapsulates interchangeable algorithms/behaviors and selects them at runtime.
- **Example:**
  - Payment processing: Different payment gateways (PayPal, Stripe) as strategies.
  - In Bentcam, different discount calculation strategies for products.

---

### 3. HashMap vs ConcurrentHashMap
- **HashMap**: Not thread-safe, allows null keys/values.
- **ConcurrentHashMap**: Thread-safe, better for concurrent access, does not allow null keys/values.

---

### 4. Methods in HashMap
- `put`, `get`, `remove`, `containsKey`, `containsValue`, `size`, `isEmpty`, `clear`, `keySet`, `values`, `entrySet`, etc.

---

### 5. Thread-safe Methods in HashMap
- None. HashMap is not thread-safe.

---

### 6. Methods in ConcurrentHashMap & Thread Safety
- Same as HashMap, plus atomic methods like `putIfAbsent`, `compute`, `computeIfAbsent`, etc.
- All public methods are thread-safe.

---

### 7. @PostConstruct and Bean Execution
- `@PostConstruct` marks a method to run after bean initialization.
- **Example:**
  - Load initial product data into cache after `ProductService` bean is created.

---

### 8. Maven: dependencyManagement vs dependencies
- **dependencyManagement**: Defines versions for dependencies to be inherited by child modules.
- **dependencies**: Declares actual dependencies for the module.

---

### 9. Why use RedisCache? Alternatives?
- **RedisCache**: Fast, distributed, supports eviction, persistence.
- **Alternatives**: EhCache, Caffeine, Hazelcast.
- **Which is better?** Depends on use case. Redis is best for distributed caching.

---

### 10. Caching Problems with Distributed Caches
- Stale data, cache inconsistency, cache stampede, network latency.

---

### 11. Protecting from Wrong/Corrupt Data in Distributed Cache
- Use cache expiry, validation, fallback to DB, and cache versioning.

---

### 12. Integer Caching
- Java caches Integer values from -128 to 127. Autoboxing within this range returns the same object.

---

### 13. Arrays.asList() and Adding Elements
- The returned list is fixed-size. `add()` or `remove()` throws `UnsupportedOperationException`.

---

### 14. How HashMap Works Internally
- Uses array of buckets. Hashes key, finds bucket, stores entry. Handles collisions via linked list or tree.

---

### 15. Find Heavier Ball Among 7 (Max 3 Splits)
- Use a balance scale: split into 3-2-2, compare, then split the heavier group, repeat. Always find in 3 weighings.

---

### 16. Java 8: Method Body in Interfaces
- Default methods allow interface evolution without breaking implementations.

---

### 17. How Many Default Methods in Interface?
- Unlimited.

---

### 18. How Many Design Patterns Exist?
- 23 classic GoF patterns, plus many more (structural, creational, behavioral, etc.).

---

### 19. Examples of Design Patterns
- Singleton, Factory, Strategy, Observer, Decorator, Adapter, etc.

---

### 20. Code Review: Singleton Bean Check
- Look for `@Scope("singleton")` (default in Spring), or only one bean instance in context.

---

### 21. Cloning a Class/Object
- Creates a shallow copy. May cause issues if object has mutable fields.

---

### 22. Ensuring Single Instantiation & Cloning
- Make constructor private, provide static `getInstance()`, override `clone()` to prevent cloning.

---

### 23. Singleton Bean Scope in Design Patterns
- Spring beans are singleton by default. Only one instance per context.

---

### 24. What Can We Do in Spring Besides APIs?
- Batch processing, messaging, scheduling, security, data access, web apps, etc.

---

### 25. @Transactional and Its Use
- Manages transactions automatically. Rolls back on exceptions.

---

### 26. Can @Transactional Be Used on Private Method?
- No. Only works on public methods (proxy-based AOP).

---

### 27. What is Microservices?
- Architecture where app is split into small, independent services.

---

### 28. Microservices vs REST API
- **Microservices**: Architectural style.
- **REST API**: Communication protocol/interface.

---

### 29. Example: Microservices vs REST API
- **Microservices**: Separate services for products, orders, users.
- **REST API**: `/api/products`, `/api/orders` endpoints.

---

### 30. EKS vs AKS
- **EKS**: Amazon Elastic Kubernetes Service.
- **AKS**: Azure Kubernetes Service. Both manage Kubernetes clusters in cloud.

---

### 31. Oracle Connection with JPA
- Configure datasource in `application.properties`, use JPA repositories for CRUD.

**Example:**
```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
spring.datasource.username=youruser
spring.datasource.password=yourpass
spring.jpa.database-platform=org.hibernate.dialect.Oracle12cDialect
```

---

# Basic Java Interview Questions & Answers

**1. What is the difference between JDK, JRE, and JVM?**
- **JDK (Java Development Kit):** Contains tools for developing Java applications (compiler, debugger, etc.) and JRE.
- **JRE (Java Runtime Environment):** Provides libraries and JVM to run Java applications.
- **JVM (Java Virtual Machine):** Executes Java bytecode, platform-independent.

**2. What is OOP? List its principles.**
- Object-Oriented Programming. Principles: Encapsulation, Inheritance, Polymorphism, Abstraction.

**3. What is the difference between == and .equals()?**
- `==` compares object references. `.equals()` compares object values/content.

**4. What is a constructor?**
- Special method to initialize objects. Called when an object is created.

**5. What is method overloading and overriding?**
- **Overloading:** Same method name, different parameters (compile-time).
- **Overriding:** Subclass provides specific implementation for a superclass method (runtime).

**6. What is an interface?**
- A contract for classes. Can contain abstract methods and default/static methods (Java 8+).

**7. What is a package in Java?**
- A namespace for organizing classes and interfaces.

**8. What is exception handling?**
- Mechanism to handle runtime errors using `try`, `catch`, `finally`, `throw`, and `throws`.

**9. What is the difference between ArrayList and LinkedList?**
- **ArrayList:** Fast random access, slow insert/delete in middle.
- **LinkedList:** Fast insert/delete, slow random access.

**10. What is a thread?**
- A lightweight process. Java supports multithreading for concurrent execution.

**11. What is synchronization?**
- Mechanism to control access to shared resources in multithreading.

**12. What is the use of 'final' keyword?**
- Used to restrict modification: final variable (constant), final method (cannot override), final class (cannot inherit).

**13. What is a static block?**
- Block of code executed when the class is loaded.

**14. What is the difference between checked and unchecked exceptions?**
- **Checked:** Checked at compile time (e.g., IOException).
- **Unchecked:** Checked at runtime (e.g., NullPointerException).

**15. What is garbage collection?**
- Automatic memory management. JVM removes unused objects.

---

# Basic Database Interview Questions & Answers

**1. What is a database?**
- Organized collection of data, typically stored and accessed electronically.

**2. What is SQL?**
- Structured Query Language, used to manage and query relational databases.

**3. What is a primary key?**
- Unique identifier for a record in a table.

**4. What is a foreign key?**
- Field in one table that refers to the primary key in another table, used for relationships.

**5. What is normalization?**
- Process of organizing data to reduce redundancy and improve integrity.

**6. What is denormalization?**
- Introducing redundancy for performance optimization.

**7. What is an index?**
- Data structure that improves the speed of data retrieval.

**8. What is a join? Name types.**
- Combines rows from two or more tables. Types: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN.

**9. What is a transaction?**
- Sequence of operations performed as a single logical unit of work. Properties: ACID (Atomicity, Consistency, Isolation, Durability).

**10. What is a view?**
- Virtual table based on the result of a query.

**11. What is a stored procedure?**
- Precompiled collection of SQL statements stored in the database.

**12. What is a trigger?**
- Procedure that automatically executes in response to certain events on a table.

**13. What is the difference between DELETE and TRUNCATE?**
- **DELETE:** Removes rows, can use WHERE, can be rolled back.
- **TRUNCATE:** Removes all rows, cannot use WHERE, faster, cannot be rolled back in some DBs.

**14. What is indexing?**
- Technique to optimize database queries by reducing the number of disk accesses.

**15. What is a schema?**
- Logical structure that defines tables, views, relationships, etc., in a database.

---

# PostgreSQL Database Interview Questions & Answers

**1. What is PostgreSQL?**
- An advanced open-source relational database management system (RDBMS) known for extensibility and standards compliance.

**2. How is PostgreSQL different from other RDBMS like MySQL or Oracle?**
- Supports advanced data types (JSON, hstore, arrays), full ACID compliance, extensibility (custom functions, data types), and strong concurrency with MVCC.

**3. What is MVCC in PostgreSQL?**
- Multi-Version Concurrency Control: Allows multiple transactions to access the database concurrently without locking, improving performance and consistency.

**4. How does PostgreSQL handle indexing?**
- Supports multiple index types: B-tree (default), Hash, GiST, SP-GiST, GIN, BRIN. You can create custom indexes for performance optimization.

**5. What are sequences in PostgreSQL?**
- Special database objects that generate unique numeric identifiers, often used for auto-incrementing primary keys.

**6. How does PostgreSQL support JSON data?**
- Native JSON and JSONB data types for storing and querying JSON documents efficiently.

**7. What is a tablespace in PostgreSQL?**
- A location on disk where the actual data files are stored. Used to manage storage and performance.

**8. How do you perform a backup and restore in PostgreSQL?**
- Use `pg_dump` for logical backups and `pg_restore` for restoring. For physical backups, use `pg_basebackup`.

**9. What is a CTE (Common Table Expression)?**
- A temporary result set defined within the execution scope of a single query, using the WITH clause. Useful for complex queries and recursion.

**10. How does PostgreSQL handle replication?**
- Supports streaming replication (master-slave), logical replication, and cascading replication for high availability and scaling.

**11. What is the difference between JSON and JSONB in PostgreSQL?**
- `JSON`: Stores data as plain text, preserves formatting.
- `JSONB`: Stores data in a decomposed binary format, faster for querying and indexing.

**12. How do you create a case-insensitive index in PostgreSQL?**
- Use the `LOWER()` function: `CREATE INDEX idx_name ON table (LOWER(column));`

**13. What is the purpose of the `VACUUM` command?**
- Cleans up dead tuples, reclaims storage, and maintains database performance.

**14. How do you enforce foreign key constraints in PostgreSQL?**
- Use the `REFERENCES` keyword in table definitions to enforce referential integrity.

**15. How do you perform full-text search in PostgreSQL?**
- Use `tsvector` and `tsquery` types, along with GIN indexes, for efficient full-text search capabilities.
