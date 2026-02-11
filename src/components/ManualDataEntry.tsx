import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportService from "@/lib/importService";

export default function ManualDataEntry() {
  const [requestType, setRequestType] = useState<"ship" | "warehouse">("ship");
  const [loading, setLoading] = useState(false);

  // حالة طلب السفينة
  const [shipForm, setShipForm] = useState({
    vesselName: "",
    imo: "",
    callSign: "",
    eta: "",
    berthRequested: "",
    cargoType: "",
    weight: "",
    contactName: "",
    contactPhone: "",
    notes: "",
    latitude: "",
    longitude: "",
  });

  // حالة طلب المخزن
  const [warehouseForm, setWarehouseForm] = useState({
    warehouseId: "",
    startDate: "",
    endDate: "",
    goodsType: "",
    quantity: "",
    dimensions: "",
    ownerName: "",
    ownerPhone: "",
    notes: "",
  });

  async function handleSubmitShip(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const row = {
        Type: "ship",
        ...Object.fromEntries(
          Object.entries(shipForm).filter(([, v]) => v !== "")
        ),
      };

      const result = await ImportService.importRequests([row], "Manual Ship Entry");
      
      if (result.success) {
        toast.success("✓ تم حفظ طلب السفينة بنجاح");
        // إعادة تعيين النموذج
        setShipForm({
          vesselName: "",
          imo: "",
          callSign: "",
          eta: "",
          berthRequested: "",
          cargoType: "",
          weight: "",
          contactName: "",
          contactPhone: "",
          notes: "",
          latitude: "",
          longitude: "",
        });
      } else {
        const errors = result.errors.map((e) => e.message).join("; ");
        toast.error("❌ فشل حفظ الطلب: " + errors);
      }
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitWarehouse(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const row = {
        Type: "warehouse",
        ...Object.fromEntries(
          Object.entries(warehouseForm).filter(([, v]) => v !== "")
        ),
      };

      const result = await ImportService.importRequests([row], "Manual Warehouse Entry");

      if (result.success) {
        toast.success("✓ تم حفظ طلب المخزن بنجاح");
        // إعادة تعيين النموذج
        setWarehouseForm({
          warehouseId: "",
          startDate: "",
          endDate: "",
          goodsType: "",
          quantity: "",
          dimensions: "",
          ownerName: "",
          ownerPhone: "",
          notes: "",
        });
      } else {
        const errors = result.errors.map((e) => e.message).join("; ");
        toast.error("❌ فشل حفظ الطلب: " + errors);
      }
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>إدخال البيانات يدويًا</CardTitle>
          <CardDescription>
            أدخل بيانات الطلب مباشرة دون استخدامملف Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={requestType}
            onValueChange={(v) => setRequestType(v as "ship" | "warehouse")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ship">🚢 طلب سفينة</TabsTrigger>
              <TabsTrigger value="warehouse">📦 طلب مخزن</TabsTrigger>
            </TabsList>

            {/* تبويب طلب السفينة */}
            <TabsContent value="ship" className="space-y-4">
              <form onSubmit={handleSubmitShip} className="space-y-4">
                
                {/* الحقول المطلوبة */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>الحقول المطلوبة:</strong> اسم السفينة، التاريخ، جهة الاتصال، النحر
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* اسم السفينة - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="vesselName" className="text-red-600">
                      اسم السفينة *
                    </Label>
                    <Input
                      id="vesselName"
                      placeholder="مثال: MV Atlas"
                      value={shipForm.vesselName}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, vesselName: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500">مثال: MV Mediterranean Express</p>
                  </div>

                  {/* IMO */}
                  <div className="space-y-2">
                    <Label htmlFor="imo">رقم IMO</Label>
                    <Input
                      id="imo"
                      placeholder="مثال: 9876543"
                      value={shipForm.imo}
                      onChange={(e) => setShipForm({ ...shipForm, imo: e.target.value })}
                    />
                  </div>

                  {/* رمز النداء */}
                  <div className="space-y-2">
                    <Label htmlFor="callSign">رمز النداء</Label>
                    <Input
                      id="callSign"
                      placeholder="مثال: MED-EX"
                      value={shipForm.callSign}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, callSign: e.target.value })
                      }
                    />
                  </div>

                  {/* تاريخ الوصول - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="eta" className="text-red-600">
                      تاريخ ووقت الوصول *
                    </Label>
                    <Input
                      id="eta"
                      type="datetime-local"
                      value={shipForm.eta}
                      onChange={(e) => setShipForm({ ...shipForm, eta: e.target.value })}
                      required
                    />
                  </div>

                  {/* النحر المطلوب - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="berthRequested" className="text-red-600">
                      النحر المطلوب *
                    </Label>
                    <Select
                      value={shipForm.berthRequested}
                      onValueChange={(v) =>
                        setShipForm({ ...shipForm, berthRequested: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النحر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Berth 1">Berth 1</SelectItem>
                        <SelectItem value="Berth 2">Berth 2</SelectItem>
                        <SelectItem value="Berth 3">Berth 3</SelectItem>
                        <SelectItem value="Berth 4">Berth 4</SelectItem>
                        <SelectItem value="Berth 5">Berth 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* نوع الحمولة */}
                  <div className="space-y-2">
                    <Label htmlFor="cargoType">نوع الحمولة</Label>
                    <Select
                      value={shipForm.cargoType}
                      onValueChange={(v) =>
                        setShipForm({ ...shipForm, cargoType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الحمولة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Cargo">حمولة عامة</SelectItem>
                        <SelectItem value="Container">حاويات</SelectItem>
                        <SelectItem value="Bulk">حمولة سائبة</SelectItem>
                        <SelectItem value="Breakbulk">قطع متفرقة</SelectItem>
                        <SelectItem value="Project Cargo">معدات ثقيلة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* الوزن */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">الوزن (طن)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="مثال: 10000"
                      value={shipForm.weight}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, weight: e.target.value })
                      }
                    />
                  </div>

                  {/* اسم جهة الاتصال - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-red-600">
                      اسم جهة الاتصال *
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="مثال: محمد الشرقاوي"
                      value={shipForm.contactName}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, contactName: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* رقم الهاتف */}
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">رقم الهاتف</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="مثال: 01001234567"
                      value={shipForm.contactPhone}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, contactPhone: e.target.value })
                      }
                    />
                  </div>

                  {/* خط العرض */}
                  <div className="space-y-2">
                    <Label htmlFor="latitude">خط العرض</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="مثال: 31.5862"
                      value={shipForm.latitude}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, latitude: e.target.value })
                      }
                    />
                  </div>

                  {/* خط الطول */}
                  <div className="space-y-2">
                    <Label htmlFor="longitude">خط الطول</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      placeholder="مثال: 31.8159"
                      value={shipForm.longitude}
                      onChange={(e) =>
                        setShipForm({ ...shipForm, longitude: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* الملاحظات */}
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    placeholder="أدخل أي ملاحظات إضافية..."
                    value={shipForm.notes}
                    onChange={(e) =>
                      setShipForm({ ...shipForm, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "جاري الحفظ..." : "💾 حفظ طلب السفينة"}
                </Button>
              </form>
            </TabsContent>

            {/* تبويب طلب المخزن */}
            <TabsContent value="warehouse" className="space-y-4">
              <form onSubmit={handleSubmitWarehouse} className="space-y-4">
                
                {/* الحقول المطلوبة */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>الحقول المطلوبة:</strong> معرّف المخزن، التواريخ، المالك، الكمية
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* معرّف المخزن - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="warehouseId" className="text-red-600">
                      معرّف المخزن *
                    </Label>
                    <Select
                      value={warehouseForm.warehouseId}
                      onValueChange={(v) =>
                        setWarehouseForm({ ...warehouseForm, warehouseId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المخزن" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WH-001">WH-001 - مخزن الشرقية</SelectItem>
                        <SelectItem value="WH-002">WH-002 - مخزن الشمالية</SelectItem>
                        <SelectItem value="WH-COLD-01">WH-COLD-01 - مخزن بارد</SelectItem>
                        <SelectItem value="WH-COLD-02">WH-COLD-02 - مخزن مُجمد</SelectItem>
                        <SelectItem value="WH-005">WH-005 - مخزن معدات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* تاريخ البدء - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-red-600">
                      تاريخ البدء *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={warehouseForm.startDate}
                      onChange={(e) =>
                        setWarehouseForm({ ...warehouseForm, startDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* تاريخ الانتهاء - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-red-600">
                      تاريخ الانتهاء *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={warehouseForm.endDate}
                      onChange={(e) =>
                        setWarehouseForm({ ...warehouseForm, endDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* نوع السلع */}
                  <div className="space-y-2">
                    <Label htmlFor="goodsType">نوع السلع</Label>
                    <Select
                      value={warehouseForm.goodsType}
                      onValueChange={(v) =>
                        setWarehouseForm({ ...warehouseForm, goodsType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع السلع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Containers">حاويات</SelectItem>
                        <SelectItem value="Machinery">معدات</SelectItem>
                        <SelectItem value="Chemicals">مواد كيماوية</SelectItem>
                        <SelectItem value="Frozen Foods">أطعمة مثلجة</SelectItem>
                        <SelectItem value="Textiles">منسوجات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* الكمية - مطلوبة */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-red-600">
                      الكمية *
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="مثال: 50"
                      value={warehouseForm.quantity}
                      onChange={(e) =>
                        setWarehouseForm({ ...warehouseForm, quantity: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* الأبعاد */}
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">الأبعاد</Label>
                    <Input
                      id="dimensions"
                      placeholder="مثال: 50x30x25"
                      value={warehouseForm.dimensions}
                      onChange={(e) =>
                        setWarehouseForm({ ...warehouseForm, dimensions: e.target.value })
                      }
                    />
                  </div>

                  {/* اسم المالك - مطلوب */}
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-red-600">
                      اسم المالك *
                    </Label>
                    <Input
                      id="ownerName"
                      placeholder="مثال: شركة الثلج البارد"
                      value={warehouseForm.ownerName}
                      onChange={(e) =>
                        setWarehouseForm({ ...warehouseForm, ownerName: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* رقم الهاتف */}
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">رقم الهاتف</Label>
                    <Input
                      id="ownerPhone"
                      type="tel"
                      placeholder="مثال: 01234567890"
                      value={warehouseForm.ownerPhone}
                      onChange={(e) =>
                        setWarehouseForm({ ...warehouseForm, ownerPhone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* الملاحظات */}
                <div className="space-y-2">
                  <Label htmlFor="warehouseNotes">ملاحظات</Label>
                  <Textarea
                    id="warehouseNotes"
                    placeholder="أدخل أي ملاحظات إضافية (مثل: درجة حرارة مطلوبة، معدات حماية)..."
                    value={warehouseForm.notes}
                    onChange={(e) =>
                      setWarehouseForm({ ...warehouseForm, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "جاري الحفظ..." : "💾 حفظ طلب المخزن"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* معلومات مساعدة */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">💡 نصائح مفيدة</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-gray-600">
          <p>✓ استخدم هذا النموذج لإدخال طلب واحد في كل مرة</p>
          <p>✓ للطلبات الكثيرة، من الأفضل استخدام ملف Excel</p>
          <p>✓ جميع الحقول المميزة بـ * مطلوبة</p>
          <p>✓ سيتم حفظ الطلب تلقائياً بعد الضغط على الزر</p>
        </CardContent>
      </Card>
    </div>
  );
}
