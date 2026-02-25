"use client";
import React, { Fragment, useState } from "react";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  // Redirect to videos page which works properly
  redirect("/admin/videos");
}
