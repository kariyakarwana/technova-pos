"use client";

import { Laptop, Monitor, Shield, Smartphone } from "lucide-react";
import type { DeviceSession } from "./profile-settings.mock";

interface RecentDevicesTableProps {
  devices: DeviceSession[];
  onSignOutDevice?: (id: string) => void;
}

export default function RecentDevicesTable({
  devices,
  onSignOutDevice,
}: RecentDevicesTableProps) {
  function getDeviceIcon(type: DeviceSession["deviceType"]) {
    if (type === "laptop") {
      return <Laptop className="h-4 w-4 text-slate-600" />;
    }
    if (type === "mobile") {
      return <Smartphone className="h-4 w-4 text-slate-600" />;
    }
    return <Monitor className="h-4 w-4 text-slate-600" />;
  }

  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl p-6 shadow-xs space-y-4 overflow-hidden">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center text-[var(--brand-green)]">
          <Shield className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
          Recent Devices
        </h2>
      </div>

      {/* Devices Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="text-slate-400 text-[11px] font-bold border-b border-[var(--brand-stroke)] pb-2 uppercase tracking-wider">
              <th className="py-2.5 px-3 font-bold">DEVICE</th>
              <th className="py-2.5 px-3 font-bold">LOCATION</th>
              <th className="py-2.5 px-3 font-bold">LAST ACTIVE</th>
              <th className="py-2.5 px-3 font-bold text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {devices.map((device) => (
              <tr
                key={device.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Device Name */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2.5">
                    {getDeviceIcon(device.deviceType)}
                    <span className="font-semibold text-slate-800">
                      {device.deviceName}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-3 text-slate-500 font-medium">
                  {device.location}
                </td>

                {/* Last Active */}
                <td className="py-3.5 px-3 font-medium">
                  {device.isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[var(--brand-green)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green)]" />
                      <span>{device.lastActive}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">{device.lastActive}</span>
                  )}
                </td>

                {/* Action */}
                <td className="py-3.5 px-3 text-right">
                  {!device.isCurrent && (
                    <button
                      type="button"
                      onClick={() => onSignOutDevice?.(device.id)}
                      className="text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
