import { FileNode } from './types';

export const INITIAL_STRUCTURE: FileNode[] = [
  {
    id: 'root',
    name: 'app',
    type: 'folder',
    path: 'app',
    children: [
      {
        id: 'build-gradle',
        name: 'build.gradle',
        type: 'file',
        path: 'app/build.gradle',
        language: 'groovy',
        content: `plugins {\n    id 'com.android.application'\n    id 'kotlin-android'\n    id 'kotlin-kapt'\n}\n\ndependencies {\n\n    implementation "androidx.core:core-ktx:1.12.0"\n    implementation "androidx.appcompat:appcompat:1.6.1"\n    implementation "com.google.android.material:material:1.11.0"\n\n    // ROOM\n    implementation "androidx.room:room-runtime:2.6.1"\n    kapt "androidx.room:room-compiler:2.6.1"\n\n    // Billing\n    implementation "com.android.billingclient:billing:7.0.0"\n}`
      },
      {
        id: 'data-folder',
        name: 'data',
        type: 'folder',
        path: 'app/data',
        children: [
          {
            id: 'cliente-kt',
            name: 'Cliente.kt',
            type: 'file',
            path: 'app/data/Cliente.kt',
            language: 'kotlin',
            content: `package com.example.app.data\n\nimport androidx.room.Entity\nimport androidx.room.PrimaryKey\n\n@Entity(tableName = "clientes")\ndata class Cliente(\n    @PrimaryKey(autoGenerate = true) val id: Int = 0,\n    val nome: String,\n    val telefone: String,\n    val email: String\n)`
          },
          {
            id: 'cliente-dao-kt',
            name: 'ClienteDao.kt',
            type: 'file',
            path: 'app/data/ClienteDao.kt',
            language: 'kotlin',
            content: `package com.example.app.data\n\nimport androidx.room.*\n\n@Dao\ninterface ClienteDao {\n\n    @Insert\n    suspend fun inserir(cliente: Cliente)\n\n    @Query("SELECT * FROM clientes")\n    suspend fun listar(): List<Cliente>\n}`
          },
          {
            id: 'app-database-kt',
            name: 'AppDatabase.kt',
            type: 'file',
            path: 'app/data/AppDatabase.kt',
            language: 'kotlin',
            content: `package com.example.app.data\n\nimport androidx.room.Database\nimport androidx.room.RoomDatabase\n\n@Database(entities = [Cliente::class], version = 1)\nabstract class AppDatabase : RoomDatabase() {\n    abstract fun clienteDao(): ClienteDao\n}`
          }
        ]
      },
      {
        id: 'ui-folder',
        name: 'ui',
        type: 'folder',
        path: 'app/ui',
        children: [
          {
            id: 'main-activity-kt',
            name: 'MainActivity.kt',
            type: 'file',
            path: 'app/ui/MainActivity.kt',
            language: 'kotlin',
            content: `package com.example.app.ui\n\nimport android.content.Intent\nimport android.os.Bundle\nimport android.widget.Button\nimport androidx.appcompat.app.AppCompatActivity\nimport com.example.app.R\n\nclass MainActivity : AppCompatActivity() {\n\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n\n        findViewById<Button>(R.id.btnCadastrar).setOnClickListener {\n            startActivity(Intent(this, CadastroClienteActivity::class.java))\n        }\n    }\n}`
          },
          {
            id: 'cadastro-activity-kt',
            name: 'CadastroClienteActivity.kt',
            type: 'file',
            path: 'app/ui/CadastroClienteActivity.kt',
            language: 'kotlin',
            content: `package com.example.app.ui\n\nimport android.os.Bundle\nimport android.widget.Button\nimport androidx.appcompat.app.AppCompatActivity\nimport androidx.room.Room\nimport com.example.app.R\nimport com.example.app.data.AppDatabase\nimport com.example.app.data.Cliente\nimport kotlinx.coroutines.CoroutineScope\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.launch\n\nclass CadastroClienteActivity : AppCompatActivity() {\n\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_cadastro)\n\n        val db = Room.databaseBuilder(\n            applicationContext,\n            AppDatabase::class.java,\n            "app-db"\n        ).build()\n\n        findViewById<Button>(R.id.btnSalvar).setOnClickListener {\n            val cliente = Cliente(\n                nome = "Cliente Exemplo",\n                telefone = "11999999999",\n                email = "cliente@email.com"\n            )\n\n            CoroutineScope(Dispatchers.IO).launch {\n                db.clienteDao().inserir(cliente)\n            }\n        }\n    }\n}`
          }
        ]
      },
      {
        id: 'billing-folder',
        name: 'billing',
        type: 'folder',
        path: 'app/billing',
        children: [
          {
            id: 'billing-manager-kt',
            name: 'BillingManager.kt',
            type: 'file',
            path: 'app/billing/BillingManager.kt',
            language: 'kotlin',
            content: `package com.example.app.billing\n\nimport android.app.Activity\nimport com.android.billingclient.api.*\n\nclass BillingManager(private val activity: Activity) {\n\n    private val billingClient = BillingClient.newBuilder(activity)\n        .setListener { result, purchases ->\n            if (result.responseCode == BillingClient.BillingResponseCode.OK) {\n                // pagamento confirmado\n            }\n        }\n        .enablePendingPurchases()\n        .build()\n\n    fun conectar() {\n        billingClient.startConnection(object : BillingClientStateListener {\n            override fun onBillingSetupFinished(result: BillingResult) {}\n            override fun onBillingServiceDisconnected() {}\n        })\n    }\n}`
          }
        ]
      },
      {
        id: 'res-folder',
        name: 'res',
        type: 'folder',
        path: 'app/res',
        children: [
          {
            id: 'layout-folder',
            name: 'layout',
            type: 'folder',
            path: 'app/res/layout',
            children: [
              {
                id: 'activity-main-xml',
                name: 'activity_main.xml',
                type: 'file',
                path: 'app/res/layout/activity_main.xml',
                language: 'xml',
                content: `<LinearLayout\n    xmlns:android="http://schemas.android.com/apk/res/android"\n    android:orientation="vertical"\n    android:gravity="center"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent">\n\n    <Button\n        android:id="@+id/btnCadastrar"\n        android:text="Cadastrar Cliente"\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"/>\n</LinearLayout>`
              },
              {
                id: 'activity-cadastro-xml',
                name: 'activity_cadastro.xml',
                type: 'file',
                path: 'app/res/layout/activity_cadastro.xml',
                language: 'xml',
                content: `<?xml version="1.0" encoding="utf-8"?>\n<LinearLayout\n    xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical"\n    android:padding="16dp">\n\n    <EditText\n        android:id="@+id/etNome"\n        android:layout_width="match_parent"\n        android:layout_height="wrap_content"\n        android:hint="Nome" />\n\n    <Button\n        android:id="@+id/btnSalvar"\n        android:layout_width="match_parent"\n        android:layout_height="wrap_content"\n        android:text="Salvar" />\n\n</LinearLayout>`
              }
            ]
          },
          {
            id: 'values-folder',
            name: 'values',
            type: 'folder',
            path: 'app/res/values',
            children: [
              {
                id: 'strings-xml',
                name: 'strings.xml',
                type: 'file',
                path: 'app/res/values/strings.xml',
                language: 'xml',
                content: `<resources>\n    <string name="app_name">Cliente Manager</string>\n    <string name="add_cliente">Novo Cliente</string>\n</resources>`
              }
            ]
          }
        ]
      },
      {
        id: 'manifest-xml',
        name: 'AndroidManifest.xml',
        type: 'file',
        path: 'app/AndroidManifest.xml',
        language: 'xml',
        content: `<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n    package="com.example.app">\n\n    <application\n        android:allowBackup="true"\n        android:label="Gestão Clientes"\n        android:theme="@style/Theme.AppCompat.Light.NoActionBar">\n\n        <activity android:name=".ui.CadastroClienteActivity"/>\n        <activity android:name=".ui.MainActivity">\n            <intent-filter>\n                <action android:name="android.intent.action.MAIN"/>\n                <category android:name="android.intent.category.LAUNCHER"/>\n            </intent-filter>\n        </activity>\n    </application>\n\n</manifest>`
      }
    ]
  }
];